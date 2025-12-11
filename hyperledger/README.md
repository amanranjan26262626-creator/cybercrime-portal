# Hyperledger Fabric Integration

## Setup Instructions

1. Install prerequisites:
   - Docker & Docker Compose
   - Go 1.20+
   - Node.js 18+

2. Start network:
```bash
cd network
./network.sh up
```

3. Deploy chaincode:
```bash
./network.sh deployCC
```

## Chaincode

The chaincode stores complaint data on Hyperledger Fabric network alongside Polygon blockchain.

## Integration

- Complaints stored on both Polygon (public) and Hyperledger (private/consortium)
- Hyperledger for sensitive police/internal data
- Polygon for public transparency

