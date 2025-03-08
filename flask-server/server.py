# # from flask import Flask, request, jsonify
# # from flask_cors import CORS
# # import os
# # import cv2
# # import numpy as np
# # import tensorflow as tf
# # from werkzeug.utils import secure_filename

# # app = Flask(__name__)
# # CORS(app)  # Enable CORS for all routes

# # # Configuration
# # app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100 MB limit
# # UPLOAD_FOLDER = "uploads"
# # ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'mp4', 'mov'}
# # os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# # # Load the deepfake detection model
# # model_path = r"D:\cidecode\flask-server\model.h5"  # Use raw string or double backslashes
# # if not os.path.exists(model_path):
# #     print(f"Error: {model_path} not found!")
# #     model = None
# # else:
# #     try:
# #         model = tf.keras.models.load_model(model_path)
# #         print("Model loaded successfully!")
# #     except Exception as e:
# #         print("Error loading model:", e)
# #         model = None

# # def allowed_file(filename):
# #     return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# # @app.route("/upload", methods=["POST"])
# # def upload_file():
# #     if "file" not in request.files:
# #         return jsonify({"error": "No file uploaded"}), 400

# #     file = request.files["file"]
# #     if file.filename == "":
# #         return jsonify({"error": "No file selected"}), 400

# #     if not allowed_file(file.filename):
# #         return jsonify({"error": "Invalid file type"}), 400

# #     # Save the uploaded file
# #     filename = secure_filename(file.filename)
# #     filepath = os.path.join(UPLOAD_FOLDER, filename)
# #     file.save(filepath)

# #     try:
# #         # Process the file
# #         if file.filename.endswith(".mp4"):
# #             frames = extract_frames(filepath)
# #             predictions = [predict_deepfake(frame) for frame in frames]
# #             result = {"is_deepfake": np.mean(predictions) > 0.5, "confidence": float(np.mean(predictions))}
# #         else:
# #             image = cv2.imread(filepath)
# #             result = {"is_deepfake": predict_deepfake(image), "confidence": float(predict_deepfake(image))}
# #     except Exception as e:
# #         return jsonify({"error": str(e)}), 500
# #     finally:
# #         # Clean up the uploaded file
# #         if os.path.exists(filepath):
# #             os.remove(filepath)

# #     return jsonify(result)

# # def extract_frames(video_path, num_frames=10):
# #     cap = cv2.VideoCapture(video_path)
# #     frames = []
# #     for _ in range(num_frames):
# #         ret, frame = cap.read()
# #         if not ret:
# #             break
# #         frames.append(frame)
# #     cap.release()
# #     return frames

# # def predict_deepfake(image):
# #     if model is None:
# #         raise ValueError("Model is not loaded. Cannot perform prediction.")

# #     image = cv2.resize(image, (224, 224))  # Resize to model input size
# #     image = image / 255.0  # Normalize
# #     image = np.expand_dims(image, axis=0)  # Add batch dimension

# #     prediction = model.predict(image)
# #     return prediction[0][0]  # Return the probability of being a deepfake

# # if __name__ == "__main__":
# #     app.run(debug=True)

# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import os
# import cv2
# import numpy as np
# import tensorflow as tf
# from werkzeug.utils import secure_filename

# app = Flask(__name__)
# CORS(app)  # Enable CORS for all routes

# # Configuration
# app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100 MB limit
# UPLOAD_FOLDER = "uploads"
# ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'mp4', 'mov'}
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# # Load the deepfake detection model
# model_path = "model.h5"  # Path to your model file
# if not os.path.exists(model_path):
#     print(f"Error: {model_path} not found!")
#     model = None
# else:
#     try:
#         model = tf.keras.models.load_model(model_path)
#         print("Model loaded successfully!")
#     except Exception as e:
#         print("Error loading model:", e)
#         model = None

# def allowed_file(filename):
#     return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# @app.route("/upload", methods=["POST"])
# def upload_file():
#     if "file" not in request.files:
#         return jsonify({"error": "No file uploaded"}), 400

#     file = request.files["file"]
#     if file.filename == "":
#         return jsonify({"error": "No file selected"}), 400

#     if not allowed_file(file.filename):
#         return jsonify({"error": "Invalid file type"}), 400

#     # Save the uploaded file
#     filename = secure_filename(file.filename)
#     filepath = os.path.join(UPLOAD_FOLDER, filename)
#     file.save(filepath)

#     try:
#         # Process the file
#         if file.filename.endswith(".mp4"):
#             frames = extract_frames(filepath)
#             predictions = [predict_deepfake(frame) for frame in frames]
#             result = {"is_deepfake": np.mean(predictions) > 0.5, "confidence": float(np.mean(predictions))}
#         else:
#             image = cv2.imread(filepath)
#             result = {"is_deepfake": predict_deepfake(image), "confidence": float(predict_deepfake(image))}
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500
#     finally:
#         # Clean up the uploaded file
#         if os.path.exists(filepath):
#             os.remove(filepath)

#     return jsonify(result)

# def extract_frames(video_path, num_frames=10):
#     cap = cv2.VideoCapture(video_path)
#     frames = []
#     for _ in range(num_frames):
#         ret, frame = cap.read()
#         if not ret:
#             break
#         frames.append(frame)
#     cap.release()
#     return frames

# def predict_deepfake(image):
#     if model is None:
#         raise ValueError("Model is not loaded. Cannot perform prediction.")

#     image = cv2.resize(image, (224, 224))  # Resize to model input size
#     image = image / 255.0  # Normalize
#     image = np.expand_dims(image, axis=0)  # Add batch dimension

#     prediction = model.predict(image)
#     return prediction[0][0]  # Return the probability of being a deepfake

# if __name__ == "__main__":
#     app.run(debug=True)

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import cv2
import numpy as np
import tensorflow as tf
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100 MB limit
UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'mp4', 'mov'}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load the deepfake detection model
model_path = "model.h5"  # Path to your model file
if not os.path.exists(model_path):
    print(f"Error: {model_path} not found!")
    model = None
else:
    try:
        model = tf.keras.models.load_model(model_path)
        print("Model loaded successfully!")
    except Exception as e:
        print("Error loading model:", e)
        model = None

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type"}), 400

    # Save the uploaded file
    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    try:
        # Process the file
        if file.filename.endswith(".mp4"):
            frames = extract_frames(filepath)
            predictions = [predict_deepfake(frame) for frame in frames]
            result = {
                "is_deepfake": np.mean(predictions) > 0.5,
                "confidence": float(np.mean(predictions))  # Convert to Python-native float
            }
        else:
            image = cv2.imread(filepath)
            prediction = predict_deepfake(image)
            result = {
                "is_deepfake": prediction > 0.5,
                "confidence": float(prediction)  # Convert to Python-native float
            }
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        # Clean up the uploaded file
        if os.path.exists(filepath):
            os.remove(filepath)

    return jsonify(result)

def extract_frames(video_path, num_frames=10):
    cap = cv2.VideoCapture(video_path)
    frames = []
    for _ in range(num_frames):
        ret, frame = cap.read()
        if not ret:
            break
        frames.append(frame)
    cap.release()
    return frames

def predict_deepfake(image):
    if model is None:
        raise ValueError("Model is not loaded. Cannot perform prediction.")

    image = cv2.resize(image, (224, 224))  # Resize to model input size
    image = image / 255.0  # Normalize
    image = np.expand_dims(image, axis=0)  # Add batch dimension

    prediction = model.predict(image)
    return float(prediction[0][0])  # Convert to Python-native float

if __name__ == "__main__":
    app.run(debug=True)