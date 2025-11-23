# Project-6 Deploying a Scalable CRUD App Using AWS Elastic Beanstalk

## Project Architecture

1. Client: Access via web browser.

2. Elastic Beanstalk:
   - Creates Load Balancer for traffic distribution.
   - Creates Auto Scaling Group with EC2 Instances (servers run the app).
   - Automatically adds EC2 instances when traffic increases (scaling).

3. RDS Database: External database for storing data (e.g., added items). Database as a Service (DaaS).

## Step 1: Prepare Application and Database

### Node.js CRUD App

- Written in Node.js for CRUD (Create, Read, Update, Delete) operations.
- package.json defines dependencies: express, mysql, body-parser.
- Starts with npm start (node app.js).
- Runs on Port 3000.
- app.js has variables for RDS connection: Host URL, User, Password, Database Name.
- Frontend: index.html in public folder.
- Zip files (app.js, package.json, public folder) as Archive.zip.

### AWS RDS Database

- Engine: MySQL.
- Template: Free tier.
- Settings: DB identifier, Master Username, Master Password.
- Instance & Storage: t4g.micro, 20GB storage.
- Connectivity:
  - Public access: Yes.
  - Security Group: Allow access from Beanstalk environment requests.
- After creation: Endpoint URL (e.g., testdb-one.xxxxx.rds.amazonaws.com), Port 3306 (MySQL).
- Update app.js with Endpoint URL, Username, Password, Database Name.

## Step 2: Create Elastic Beanstalk Environment

1. Create Environment:
   - Application name: Crud-app.
   - Environment name: Crud-hyphen-env.
   - Platform: Node.js, version e.g., 14.
   - Application code: Sample application.
   - Presets: Custom configuration.

2. Configure Service Access:
   - Create or use Service Role and EC2 instance profile for permissions (EC2 instances, Security Groups).

3. Configure Networking and Database:
   - Networking: Default VPC, multiple subnets (for High Availability).
   - Database: No configuration (use external RDS).

4. Configure Instance Traffic and Scaling:
   - Capacity: Single instance.
   - Security Group: Allow inbound traffic on Port 3000 (app runs on 3000).

5. Review and Submit:
   - Creates EC2 instance, S3 bucket (for logs), Elastic IP.
   - Environment Health: Green and Ok.

## Step 3: Deploy and Validate

1. Initial Check (Sample App):
   - Click domain link, shows Congratulations sample application.

2. Deploy App:
   - In console, Upload and deploy.
   - Choose Archive.zip.
   - Version label: crudapp-version-1.
   - Deploy.

3. Deployment Process:
   - Updates environment (all at once).
   - Replaces sample app with zip code on EC2 instance.
   - Successful, Health Green.

4. Test (502 Error):
   - Domain shows 502 Bad Gateway.
   - Reason: Nginx proxy looks for default port 80, app on 3000.
   - Solution: Add :3000 to URL (e.g., http://crudapp-env.elasticbeanstalk.com:3000).

5. Final Validation:
   - UI (index.html) shows.
   - Add Item: Enter name (e.g., beanstack-project) (Create to RDS).
   - Get Items: Shows added item (Read from RDS).
   - Delete Item: Enter ID, delete (Delete from RDS).
   - Get Items: List empty.

## Conclusion

Successfully deployed Node.js app with external RDS on AWS Elastic Beanstalk. Beanstalk manages servers, logging, scaling; focus on application code.

This project demonstrates the deployment of a simple CRUD (Create, Read, Update, Delete) application using AWS Elastic Beanstalk, a Platform-as-a-Service (PaaS) offering. The primary focus is to explore how PaaS can simplify the deployment, management, and scaling of web applications by abstracting infrastructure management.

## Architecture Diagram

1. Client and DNS:
   - Client (e.g., web browser) accesses domain name.
   - Route 53 (AWS DNS) resolves to Load Balancer IP.

2. Elastic Load Balancer (ELB):
   - Client sends HTTP request to ELB.
   - ELB distributes traffic to servers (EC2 instances).

3. Application Environment:
   - EC2: Runs Node.js application code.
   - VPC: Secure private network for EC2 instances.
   - Auto-scaling: Monitors load.
     - Scales out: Adds EC2 instances if traffic increases.
     - Scales in: Removes instances if traffic decreases.
   - App Version Deployment: Deploy new versions to environment.
