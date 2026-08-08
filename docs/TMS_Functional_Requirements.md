# TMS Functional Requirements (BRD)

## 1. CUSTOMER MANAGEMENT
─────────────────────────────────────
Customer Login -> Raise Transport Indent -> Admin Review -> [Reject / Approve] -> Notify / Start Procurement

## 2. PROCUREMENT (INTERNAL)
─────────────────────────────────────
System finds nearby Suppliers (Based on Pincode / Region / Vehicle Type) -> Send RFQ to Suppliers -> Suppliers submit (Vehicle, Driver, Rate, Availability) -> Admin compares quotations -> Select Best Supplier -> Calculate Margin -> Create Customer SQ

## 3. CUSTOMER APPROVAL
─────────────────────────────────────
Customer receives SQ -> Approve / Reject -> [Reject: Close / Approve: Customer PO] -> Admin accepts PO

## 4. VEHICLE CONFIRMATION
─────────────────────────────────────
Confirm Vehicle with Supplier -> Vehicle Assigned -> Driver Assigned -> Supervisor Assigned

## 5. LOADING PROCESS
─────────────────────────────────────
Truck reaches Pickup -> Supervisor verifies Truck -> Material Loading -> Generate LR (Lorry Receipt) -> Generate Unique Tracking Number -> Duplicate Number Validation -> Create Digital Consignment -> Generate PDF (Terms & Conditions) -> Print Hard Copy

## 6. PAYMENT PROCESS
─────────────────────────────────────
Broker Details -> Sent to Finance -> Finance verifies -> HDFC API Payment -> Generate UTR Number -> UTR sent to (Supplier, Driver) -> 90% Advance Completed

## 7. TRIP EXECUTION
─────────────────────────────────────
Trip Starts -> GPS Tracking -> Geo Tagging -> ETA Calculation -> Live Route -> Map Tracking -> Incident Reporting -> Delay -> Detention -> Halt -> Extra Day Calculation -> Customer Tracking

## 8. DELIVERY
─────────────────────────────────────
Vehicle reaches Destination -> Unload -> Capture (POD, Customer Signature, Customer Seal, ADITI TRANS Seal) -> Upload Documents -> Delivery Completed

## 9. POD RETURN PROCESS
─────────────────────────────────────
Smartphone Driver (Upload immediately) OR Keypad Driver (Call Office -> Courier Original POD -> POD Received) -> Within 30 Days ? -> [Yes: Release 10% / No: Apply Claim Rules] -> Incentive + Courier Charge + Remaining Payment

## 10. TRIP CLOSURE
─────────────────────────────────────
Invoice Verification -> Expense Verification -> Final Settlement -> Trip Closed

---

## Detailed Functional Workflows

### RFQ & Supplier Confirmation Flow
1. **Customer Creates Indent:** Customer raises a transport indent (From, To, Vehicle Category, Load Details).
2. **Internal Review:** Admin/Transport Team reviews and creates an RFQ.
3. **Send RFQ to Customer:** Customer receives notification, downloads RFQ securely (OTP/MFA verified). Customer enters minimal data (From, Dest, Category, Rate, Remarks) and Submits/Accepts/Rejects.
4. **AI-Based Supplier Recommendation:** Once RFQ approved, system suggests suppliers based on Pickup Pincode, nearby pincodes, city, and network. Transport team sends RFQ to selected suppliers.
5. **Supplier Receives RFQ:** Supplier submits quoted rate.
6. **Quotation Decision:** Transport Team accepts or rejects supplier quotation.
7. **Order Confirmation:** Sent to both Supplier and Customer.
8. **Vehicle Confirmation by Supplier:** Supplier provides Vehicle Number, Type, Driver Name/Contact, Fleet Details.
9. **Payment Details:** Supplier specifies payment to Supplier (fetches bank details from Supplier Master) or Driver (one-time manual entry of Driver Name, Bank A/C, IFSC, UPI ID with PAN/Bank Proof upload for new beneficiaries).

### GPS Tracking & Geotagging
* **Geotagging:** Captures specific event locations (Latitude, Longitude, Address, Timestamp) for Loading Point, Delivery Point, etc.
* **GPS Tracking:** Continuously tracks vehicle movement, route history, speed, and ETA via Driver Mobile App (preferred) or Third-Party GPS Device.
* **Trip Milestone Tracking:** Auto-records timestamps for Reached Loading Point, Loading Completed, Trip Started, Reached Destination, Unloading Completed.

### Customer Communication & Portal
* **Customer Portal:** Displays Trip Status, ETA, Vehicle, Driver, and Supervisor details.
* **Notifications:** Shares Vehicle, Driver, and Supervisor info after vehicle confirmation.
* **Trip Start Email:** Automatically sent with Vehicle, Driver, Supervisor, Locations, and Attachments when the trip begins.
* **Pricing Security:** Customers only see the Final Freight Amount (Selling Price). Supplier quotations, internal margins, and purchase rates are completely hidden from the customer.

### Customer Rate Contracts
* **Annual Contract:** System auto-picks predefined rates from the Customer Price List based on Source, Destination, and Vehicle.
* **Case-to-Case Quotation:** Sales team creates a custom quotation for new/one-time routes for customer approval.
* **Customer Master:** Each customer is configured for either Annual Contract or Case-to-Case pricing models.

### Loading Confirmation & Documents (POD)
* **Loading Confirmation:** Records loading completion time, geotag, and vehicle details before dispatch.
* **Document Management:** Allows uploading/storing Invoices, LRs, Delivery Challans, and E-Way Bills.
* **Customer Updates:** Notifies customer when vehicle is loaded and trip has started.
* **Proof of Delivery (POD):** Captures delivery acknowledgement, customer signature/seal, and uploads signed POD to trigger the Trip Closure and final payment processes.
