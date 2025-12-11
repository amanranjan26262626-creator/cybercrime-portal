package main

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type ComplaintContract struct {
	contractapi.Contract
}

type Complaint struct {
	ID              string `json:"id"`
	ComplaintNumber string `json:"complaint_number"`
	UserID          string `json:"user_id"`
	CrimeType       string `json:"crime_type"`
	Description     string `json:"description"`
	Status          string `json:"status"`
	SeverityScore   int    `json:"severity_score"`
	IPFSHash        string `json:"ipfs_hash"`
	PolygonTxHash   string `json:"polygon_tx_hash"`
	CreatedAt       string `json:"created_at"`
}

func (c *ComplaintContract) CreateComplaint(ctx contractapi.TransactionContextInterface, complaintJSON string) error {
	var complaint Complaint
	err := json.Unmarshal([]byte(complaintJSON), &complaint)
	if err != nil {
		return fmt.Errorf("failed to unmarshal complaint: %v", err)
	}

	complaintBytes, err := json.Marshal(complaint)
	if err != nil {
		return fmt.Errorf("failed to marshal complaint: %v", err)
	}

	return ctx.GetStub().PutState(complaint.ID, complaintBytes)
}

func (c *ComplaintContract) GetComplaint(ctx contractapi.TransactionContextInterface, id string) (*Complaint, error) {
	complaintBytes, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}

	if complaintBytes == nil {
		return nil, fmt.Errorf("complaint %s does not exist", id)
	}

	var complaint Complaint
	err = json.Unmarshal(complaintBytes, &complaint)
	if err != nil {
		return nil, err
	}

	return &complaint, nil
}

func (c *ComplaintContract) UpdateStatus(ctx contractapi.TransactionContextInterface, id string, newStatus string) error {
	complaint, err := c.GetComplaint(ctx, id)
	if err != nil {
		return err
	}

	complaint.Status = newStatus
	complaintBytes, err := json.Marshal(complaint)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, complaintBytes)
}

func main() {
	complaintContract, err := contractapi.NewChaincode(&ComplaintContract{})
	if err != nil {
		log.Panicf("Error creating complaint chaincode: %v", err)
	}

	if err := complaintContract.Start(); err != nil {
		log.Panicf("Error starting complaint chaincode: %v", err)
	}
}

