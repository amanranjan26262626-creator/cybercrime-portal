const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CybercrimeReport", function () {
  let cybercrimeReport;
  let owner;
  let police;
  let citizen;

  beforeEach(async function () {
    [owner, police, citizen] = await ethers.getSigners();

    const CybercrimeReport = await ethers.getContractFactory("CybercrimeReport");
    cybercrimeReport = await CybercrimeReport.deploy();
    await cybercrimeReport.waitForDeployment();

    // Grant police role
    await cybercrimeReport.grantPoliceRole(police.address);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await cybercrimeReport.hasRole(await cybercrimeReport.DEFAULT_ADMIN_ROLE(), owner.address)).to.be.true;
    });

    it("Should start with zero complaints", async function () {
      expect(await cybercrimeReport.complaintCount()).to.equal(0);
    });
  });

  describe("Submit Complaint", function () {
    it("Should allow citizen to submit complaint", async function () {
      const ipfsHash = "QmTestHash123";
      const severity = 75;

      await expect(
        cybercrimeReport.connect(citizen).submitComplaint(ipfsHash, severity)
      )
        .to.emit(cybercrimeReport, "ComplaintSubmitted")
        .withArgs(1, citizen.address, ipfsHash, severity);

      const complaint = await cybercrimeReport.getComplaint(1);
      expect(complaint.ipfsHash).to.equal(ipfsHash);
      expect(complaint.severity).to.equal(severity);
      expect(complaint.reporter).to.equal(citizen.address);
    });

    it("Should reject empty IPFS hash", async function () {
      await expect(
        cybercrimeReport.connect(citizen).submitComplaint("", 50)
      ).to.be.revertedWith("IPFS hash required");
    });

    it("Should reject invalid severity score", async function () {
      await expect(
        cybercrimeReport.connect(citizen).submitComplaint("QmHash", 101)
      ).to.be.revertedWith("Invalid severity score");
    });
  });

  describe("Update Status", function () {
    beforeEach(async function () {
      await cybercrimeReport.connect(citizen).submitComplaint("QmHash", 50);
    });

    it("Should allow police to update status", async function () {
      await expect(
        cybercrimeReport.connect(police).updateStatus(1, 1) // Status.Verified
      )
        .to.emit(cybercrimeReport, "StatusUpdated")
        .withArgs(1, 0, 1, police.address);

      const complaint = await cybercrimeReport.getComplaint(1);
      expect(complaint.status).to.equal(1); // Verified
    });

    it("Should reject non-police from updating status", async function () {
      await expect(
        cybercrimeReport.connect(citizen).updateStatus(1, 1)
      ).to.be.reverted;
    });
  });

  describe("Assign Complaint", function () {
    beforeEach(async function () {
      await cybercrimeReport.connect(citizen).submitComplaint("QmHash", 50);
    });

    it("Should allow police to assign complaint", async function () {
      const policeOfficer = await ethers.Wallet.createRandom();
      await expect(
        cybercrimeReport.connect(police).assignComplaint(1, policeOfficer.address)
      )
        .to.emit(cybercrimeReport, "ComplaintAssigned")
        .withArgs(1, policeOfficer.address);

      const complaint = await cybercrimeReport.getComplaint(1);
      expect(complaint.assignedTo).to.equal(policeOfficer.address);
    });
  });

  describe("File FIR", function () {
    beforeEach(async function () {
      await cybercrimeReport.connect(citizen).submitComplaint("QmHash", 50);
    });

    it("Should allow police to file FIR", async function () {
      const firNumber = "JH/ST001/2026/1234";
      await expect(
        cybercrimeReport.connect(police).fileFIR(1, firNumber)
      )
        .to.emit(cybercrimeReport, "FIRFiled")
        .withArgs(1, firNumber, police.address);

      const complaint = await cybercrimeReport.getComplaint(1);
      expect(complaint.firNumber).to.equal(firNumber);
      expect(complaint.status).to.equal(3); // FIRFiled
    });
  });
});

