// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract CybercrimeReport is AccessControl, ReentrancyGuard {
    bytes32 public constant POLICE_ROLE = keccak256("POLICE_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    enum Status {
        Submitted,
        Verified,
        UnderInvestigation,
        FIRFiled,
        Closed,
        Rejected
    }

    struct Complaint {
        uint256 id;
        string ipfsHash;
        address reporter;
        uint8 severity;
        Status status;
        uint256 timestamp;
        address assignedTo;
        string firNumber;
    }

    mapping(uint256 => Complaint) public complaints;
    mapping(address => uint256[]) public userComplaints;
    uint256 public complaintCount;

    event ComplaintSubmitted(
        uint256 indexed complaintId,
        address indexed reporter,
        string ipfsHash,
        uint8 severity
    );
    event StatusUpdated(
        uint256 indexed complaintId,
        Status oldStatus,
        Status newStatus,
        address updatedBy
    );
    event ComplaintAssigned(
        uint256 indexed complaintId,
        address indexed policeOfficer
    );
    event FIRFiled(
        uint256 indexed complaintId,
        string firNumber,
        address filedBy
    );

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    function submitComplaint(
        string memory ipfsHash,
        uint8 severity
    ) external nonReentrant returns (uint256) {
        require(bytes(ipfsHash).length > 0, "IPFS hash required");
        require(severity <= 100, "Invalid severity score");

        complaintCount++;
        uint256 complaintId = complaintCount;

        complaints[complaintId] = Complaint({
            id: complaintId,
            ipfsHash: ipfsHash,
            reporter: msg.sender,
            severity: severity,
            status: Status.Submitted,
            timestamp: block.timestamp,
            assignedTo: address(0),
            firNumber: ""
        });

        userComplaints[msg.sender].push(complaintId);

        emit ComplaintSubmitted(complaintId, msg.sender, ipfsHash, severity);

        return complaintId;
    }

    function updateStatus(
        uint256 complaintId,
        Status newStatus
    ) external onlyRole(POLICE_ROLE) {
        require(complaints[complaintId].id != 0, "Complaint does not exist");

        Status oldStatus = complaints[complaintId].status;
        complaints[complaintId].status = newStatus;

        emit StatusUpdated(complaintId, oldStatus, newStatus, msg.sender);
    }

    function assignComplaint(
        uint256 complaintId,
        address policeOfficer
    ) external onlyRole(POLICE_ROLE) {
        require(complaints[complaintId].id != 0, "Complaint does not exist");
        require(policeOfficer != address(0), "Invalid police officer address");

        complaints[complaintId].assignedTo = policeOfficer;

        emit ComplaintAssigned(complaintId, policeOfficer);
    }

    function fileFIR(
        uint256 complaintId,
        string memory firNumber
    ) external onlyRole(POLICE_ROLE) {
        require(complaints[complaintId].id != 0, "Complaint does not exist");
        require(bytes(firNumber).length > 0, "FIR number required");

        complaints[complaintId].firNumber = firNumber;
        complaints[complaintId].status = Status.FIRFiled;

        emit FIRFiled(complaintId, firNumber, msg.sender);
    }

    function getComplaint(
        uint256 complaintId
    ) external view returns (Complaint memory) {
        require(complaints[complaintId].id != 0, "Complaint does not exist");
        return complaints[complaintId];
    }

    function getUserComplaints(
        address user
    ) external view returns (uint256[] memory) {
        return userComplaints[user];
    }

    function getComplaintsByStatus(
        Status status
    ) external view returns (uint256[] memory) {
        uint256[] memory result = new uint256[](complaintCount);
        uint256 count = 0;

        for (uint256 i = 1; i <= complaintCount; i++) {
            if (complaints[i].status == status) {
                result[count] = i;
                count++;
            }
        }

        // Resize array to actual count
        uint256[] memory finalResult = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            finalResult[i] = result[i];
        }

        return finalResult;
    }

    function grantPoliceRole(address account) external onlyRole(ADMIN_ROLE) {
        grantRole(POLICE_ROLE, account);
    }

    function revokePoliceRole(address account) external onlyRole(ADMIN_ROLE) {
        revokeRole(POLICE_ROLE, account);
    }
}

