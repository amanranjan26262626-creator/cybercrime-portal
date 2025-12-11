from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, storage, firestore
from services.ai_service import AIService
from services.analytics_service import AnalyticsService
from services.did_service import DIDService

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize Firebase
if not firebase_admin._apps:
    cred = credentials.Certificate(os.getenv('FIREBASE_CREDENTIALS_PATH'))
    firebase_admin.initialize_app(cred, {
        'storageBucket': os.getenv('FIREBASE_STORAGE_BUCKET')
    })

# Initialize services
ai_service = AIService()
analytics_service = AnalyticsService()
did_service = DIDService()

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'python-backend'})

@app.route('/api/ai/analyze', methods=['POST'])
def analyze_complaint():
    """Advanced AI analysis using Gemini"""
    data = request.json
    result = ai_service.analyze_complaint(data.get('text'), data.get('language', 'hi'))
    return jsonify({'success': True, 'data': result})

@app.route('/api/analytics/dashboard', methods=['GET'])
def get_analytics():
    """Get analytics data"""
    data = analytics_service.get_dashboard_stats()
    return jsonify({'success': True, 'data': data})

@app.route('/api/did/create', methods=['POST'])
def create_did():
    """Create W3C Verifiable Credential"""
    data = request.json
    credential = did_service.create_credential(data)
    return jsonify({'success': True, 'data': credential})

@app.route('/api/did/verify', methods=['POST'])
def verify_credential():
    """Verify W3C Verifiable Credential"""
    data = request.json
    result = did_service.verify_credential(data.get('credential'))
    return jsonify({'success': True, 'verified': result})

@app.route('/api/firebase/upload', methods=['POST'])
def upload_to_firebase():
    """Upload file to Firebase Storage"""
    if 'file' not in request.files:
        return jsonify({'success': False, 'message': 'No file provided'}), 400
    
    file = request.files['file']
    bucket = storage.bucket()
    blob = bucket.blob(file.filename)
    blob.upload_from_file(file)
    blob.make_public()
    
    return jsonify({
        'success': True,
        'url': blob.public_url,
        'path': blob.name
    })

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)

