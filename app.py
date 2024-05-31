from flask import Flask, request, jsonify, send_file
import cv2
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 


harcascade_path = "haarcascade_russian_plate_number.xml"
plate_cascade = cv2.CascadeClassifier(harcascade_path)
min_area = 500

def detect_number_plate(image_path, output_path):
    img = cv2.imread(image_path)

    if img is None:
        return "Could not read image", None

    img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    plates = plate_cascade.detectMultiScale(img_gray, 1.1, 4)

    for (x, y, w, h) in plates:
        area = w * h

        if area > min_area:
            cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)
            cv2.putText(img, "Number Plate", (x, y - 5), cv2.FONT_HERSHEY_COMPLEX_SMALL, 1, (255, 0, 255), 2)

            img_roi = img[y: y + h, x: x + w]
            cv2.imwrite(output_path, img_roi)

    return None, output_path

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No file selected for uploading'}), 400

    if file:
        temp_input_path = os.path.join("Files", file.filename)
        temp_output_path = os.path.join("Files", f"detected_{file.filename}")
        file.save(temp_input_path)

        error, processed_image_path = detect_number_plate(temp_input_path, temp_output_path)

        if error:
            return jsonify({'error': error}), 400

        # Return the path to the processed image
        print(f'the ----> {processed_image_path} and the type is :- {type(processed_image_path)}')
        return jsonify({'processed_image_path': processed_image_path}), 200

    return jsonify({'error': 'Unknown error occurred'}), 500

@app.route('/processed_image/<filename>', methods=['GET'])
def get_processed_image(filename):
    return send_file(os.path.join("Files", filename), mimetype='image/jpeg')

if __name__ == "__main__":
    if not os.path.exists('Files'):
        os.makedirs('Files')
    app.run(debug=True)
