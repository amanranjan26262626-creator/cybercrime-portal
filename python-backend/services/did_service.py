from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.backends import default_backend
import json
import base64
from datetime import datetime, timedelta
from typing import Dict, Any

class DIDService:
    """W3C Verifiable Credentials implementation"""
    
    def __init__(self):
        # In production, use proper key management
        self.private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=2048,
            backend=default_backend()
        )
        self.public_key = self.private_key.public_key()
    
    def create_credential(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create W3C Verifiable Credential"""
        credential = {
            "@context": [
                "https://www.w3.org/2018/credentials/v1",
                "https://www.w3.org/2018/credentials/examples/v1"
            ],
            "id": f"https://cybercrime-portal.in/credentials/{data.get('id', 'temp')}",
            "type": ["VerifiableCredential", "CybercrimeComplaintCredential"],
            "issuer": {
                "id": "did:web:cybercrime-portal.in",
                "name": "Cybercrime Portal"
            },
            "issuanceDate": datetime.utcnow().isoformat() + "Z",
            "credentialSubject": {
                "id": data.get('user_id'),
                "complaint_id": data.get('complaint_id'),
                "complaint_number": data.get('complaint_number'),
                "status": data.get('status')
            },
            "credentialStatus": {
                "id": f"https://cybercrime-portal.in/status/{data.get('id')}",
                "type": "CredentialStatusList2020"
            }
        }
        
        # Create proof (signature)
        proof = self._create_proof(credential)
        credential['proof'] = proof
        
        return credential
    
    def verify_credential(self, credential: Dict[str, Any]) -> bool:
        """Verify W3C Verifiable Credential"""
        try:
            proof = credential.get('proof', {})
            if not proof:
                return False
            
            # Verify signature
            signature = base64.b64decode(proof.get('signatureValue', ''))
            message = json.dumps(credential, sort_keys=True).encode()
            
            self.public_key.verify(
                signature,
                message,
                padding.PSS(
                    mgf=padding.MGF1(hashes.SHA256()),
                    salt_length=padding.PSS.MAX_LENGTH
                ),
                hashes.SHA256()
            )
            
            return True
        except Exception:
            return False
    
    def _create_proof(self, credential: Dict[str, Any]) -> Dict[str, Any]:
        """Create cryptographic proof for credential"""
        # Remove proof if exists
        cred_copy = {k: v for k, v in credential.items() if k != 'proof'}
        message = json.dumps(cred_copy, sort_keys=True).encode()
        
        signature = self.private_key.sign(
            message,
            padding.PSS(
                mgf=padding.MGF1(hashes.SHA256()),
                salt_length=padding.PSS.MAX_LENGTH
            ),
            hashes.SHA256()
        )
        
        return {
            "type": "RsaSignature2018",
            "created": datetime.utcnow().isoformat() + "Z",
            "proofPurpose": "assertionMethod",
            "verificationMethod": "did:web:cybercrime-portal.in#keys-1",
            "signatureValue": base64.b64encode(signature).decode()
        }

