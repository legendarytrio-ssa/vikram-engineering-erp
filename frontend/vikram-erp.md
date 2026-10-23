# All Over PROBLEM STATEMENT

Vikram Engineering Wants to build a Platform which will hoist their Business. Their Business workflow model is basically Applying for Govt/Pvt Tenders with Documentation, getting Purchase Orders and with a PO(Purchase Order), Buy/Allocate Materials, Handle Finance & Sales & Marketing.


# Flow of Process:
Sales & Marketing Manually Searches & Finds Govt/Pvt Tenders --> If Suitable, List Tender with Details & Create a Tender in our App --> This Created Tender is sent to CEO for Sorting & Approval --> Out of many Tenders and their Documentations, CEO sorts Tenders and either discard them or produce documentation for their Application --> This Documentation of this Tender is then manually applied by Sales Team (It's Copy Remains in our DB) --> If Out of Submitted Tenders, Purchase Order Comes, CEO Searches the Tender and Produces a Project where Tender is now upgraded to a Live Project. All of it's Details and Copy is sent to respective Departments as per Authorization

# Departments and Their Workflow

## Operations Department

### Quality Control 

When a Project Copy Comes to Operations, it has 2 Sub Departments. 
Firstly is "Quality Control" --> This Department will contain Projects made and thier Quality Control Documentation uploaded by Dept.
So an Interface for Project Details, Many Documentation Upload and Notes for Project Will Work Fine.

### Purchase Department
Purchase Department will handle Raw Material Allocation and Vendor,Contractor Selection.
So Here The Department basically selects the Materials required for the Project and gives Orders for Vendors & Contractors. A Basic Table Structure is shown:

No. | Raw_Material | Vendor/Contractor(Name) | Budget_Allocation | Actual_Bill_Amount | Send_to_Finance


After the necessary Allocations Finalized, Dept will send these Details to Finance Dept by clicking on Send to Finance Button for Payments. 

## Finance Department

### Monthly Wages and Salary and Additional Expenses

The Finance Department will handle Monthly Wages & Salary and can track them
Blue Print Will be Given with other files.
Principal Idea will be Same.
Same Structure Provided for Salary in a Monthly Basis will be set for Wages in a weekly and Additional Expenses in a Daily Basis.

### Operations Finance

All of the Data sent by Operations Department for Payment is to be handled by Operations Finance.
This List will be maintained for Clients & Vendor/Contractor.

### Ledgers

For any individual, Our App must give a ledger in a format of all Done Financial Transactions performed with the individual.
For Vendors/Clients/Contractors our App must issue Ledger(Exact Format will be Given Later)
A Generic Format:
Date || Particulars || Amount || Type(Debit(Paid)/Credit(Due))

There will also be a Project Ledger where the Ledger will be maintained even for Projects with all Transacions made by Different Parties Related to the Project.


## Sales & Marketing

### Tender List
Will Contain Tender List of All Applied Tenders along with given Documentations(After CEO Gives Documentation of the Tender and if PO Comes, This Tender Will be upgraded to a Project). 

### Client List
Will Contain Clients Lists and their Details As Given by Sales Dept. This List will be used later during Project Creations and Payments. If Client Exists, then just add them in Projects by Searching else just Create New Client and Add.



## Some Important Discussions

### ChatRoom
A Unique chatroom based on Projects will contain All Dept Employees Associated with the Project. Sales & Marketing Dept Employee can easily Update them and they can talk over the Project in it's Chatroom.

### Security Perspective
Data must be Secure and Authentication/Authorization must be maintained for Data Security

### Project Create
From Tender List, the Project Create can be issued via the CEO with necessary additions.

### Authorization
CEO can freely handle/view/manipulate all Departments and Sub Departments but Each Department Employee is restricted to their own Department and sometimes to their own SubDepartment

