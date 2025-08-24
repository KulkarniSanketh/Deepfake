from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
import tempfile
import os
import cv2

app = Flask(__name__)
CORS(app)

pipe = pipeline("image-classification", model="prithivMLmods/deepfake-detector-model-v1")

@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    filename = file.filename

    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        file.save(tmp.name)
        tmp_path = tmp.name

    result_data = {}
    try:
        if filename.lower().endswith((".jpg", ".jpeg", ".png", ".bmp", ".webp")):
            preds = pipe(tmp_path)
            best = max(preds, key=lambda x: x["score"])
            result_data = {
                "type": "image",
                "label": best["label"],
                "confidence": float(best["score"]),
                "is_deepfake": best["label"].lower() == "fake",
                "model_used": "prithivMLmods/deepfake-detector-model-v1"
            }

        elif filename.lower().endswith((".mp4", ".avi", ".mov", ".mkv", ".webm")):
            cap = cv2.VideoCapture(tmp_path)
            frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            step = max(1, frame_count // 10)  # sample ~10 frames
            idx, analyzed, deepfake_frames = 0, 0, 0
            frame_results = []

            while True:
                ret, frame = cap.read()
                if not ret:
                    break
                if idx % step == 0:
                    frame_path = tmp_path + f"_frame_{idx}.jpg"
                    cv2.imwrite(frame_path, frame)
                    preds = pipe(frame_path)
                    best = max(preds, key=lambda x: x["score"])
                    conf = float(best["score"])
                    is_fake = best["label"].lower() == "fake"
                    frame_results.append({
                        "frame": idx,
                        "label": best["label"],
                        "confidence": conf,
                        "is_deepfake": is_fake
                    })
                    if is_fake:
                        deepfake_frames += 1
                    os.remove(frame_path)
                    analyzed += 1
                idx += 1
            cap.release()

            result_data = {
                "type": "video",
                "frames_analyzed": analyzed,
                "deepfake_frames": deepfake_frames,
                "label": "FAKE" if deepfake_frames > analyzed / 2 else "REAL",
                "confidence": deepfake_frames / analyzed if analyzed > 0 else 0,
                "is_deepfake": deepfake_frames > analyzed / 2,
                "frame_results": frame_results,
                "model_used": "prithivMLmods/deepfake-detector-model-v1",
                "processing_note": f"Analyzed {analyzed} frames from {frame_count} total"
            }
        else:
            return jsonify({"error": "Unsupported file type"}), 400

    finally:
        os.remove(tmp_path)

    return jsonify(result_data)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
