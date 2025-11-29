# Project: Deploying a Scalable CRUD App Using AWS Elastic Beanstalk

## Project Architecture
1. **Client**: Access via web browser.
2. **Elastic Beanstalk**:
   - Creates Load Balancer for traffic distribution.
   - Creates Auto Scaling Group with EC2 Instances (servers run the app).
   - Automatically adds EC2 instances when traffic increases (scaling).
3. **RDS Database**: External database for storing data (e.g., added items). Database as a Service (DaaS).

**Key Advantage**: We do not need to manage servers, scaling, load balancing, or any infrastructure. All of this is fully managed by Elastic Beanstalk.

## Step-by-Step Implementation

### 1. Create RDS MySQL Database (External DB)
- Create MySQL RDS instance (Free Tier eligible).
- Note down:
  - Endpoint URL (e.g., `mydb.abcdefghijk.us-east-1.rds.amazonaws.com`)
  - Port: `3306`
  - Database name, Username, Password

### 2. Update Node.js Application Code (`app.js`)
Update the database connection in `app.js`:

```javascript
const connection = mysql.createPool({
  host     : 'your-rds-endpoint.xxxx.rds.amazonaws.com',  // Change RDS database details of app.js
  user     : 'admin',
  password : 'yourpassword',
  database : 'cruddb',
  port     : 3306
});
```

**Why needed**: The app must point to the actual RDS instance to store and retrieve data.

### 3. Archive the Website Files



Create a ZIP file containing:
- `app.js`
- `package.json`
- `public/` folder

**Command (run in project root):**
```bash
zip -r Archive.zip app.js package.json public/
```

**Why this command**: Elastic Beanstalk only accepts ZIP archives for deployment. `-r` ensures all files inside `public/` folder are included recursively.

### 4. Create Elastic Beanstalk Application & Environment
1. Go to AWS Elastic Beanstalk Console → **Create application**
   - Application name: `crudapp`
2. Create environment:
   - Environment name: `crudapp-env`
   - Platform: Node.js (latest supported version)
   - Upload code: **Sample application** (will be replaced later)

### 5. Upload and Deploy the Application
1. Go to environment → `crudapp-env`
2. Click **Upload and Deploy**
3. Choose `Archive.zip`
4. Version label: `v1.0`
5. Click **Deploy**

#### Deployment Process:
- Updates environment (all at once).
- Replaces sample app with your ZIP code on the EC2 instance.
- After completion → Health turns **Green**.

### 6. Access the Application
1. Copy the environment URL (e.g., `crudapp-env.eba-xyzabc.us-east-1.elasticbeanstalk.com`)
2. Open in browser **with port 3000**:
   ```
   http://crudapp-env.eba-xyzabc.us-east-1.elasticbeanstalk.com:3000
   ```

#### Common Issue: 502 Bad Gateway Error
- **Symptoms**: Opening URL without `:3000` shows **502 Bad Gateway**
- **Reason**: Nginx reverse proxy (default in Beanstalk) listens on port 80 and forwards to port 80, but your Node.js app runs on port 3000.
- **Solution**: Always access via `:3000` (temporary fix for single-instance environment).

### 7. Final Validation (Test CRUD Operations)
- **Create Table** → Creates table in RDS
- **Add Item** → Inserts data into RDS
- **Get Items** → Reads data from RDS
- **Update Item** → Updates record
- **Delete Item** → Deletes record by ID

All operations successfully interact with the external RDS database.

## Services Used (Managed by Elastic Beanstalk)
- Elastic Beanstalk (PaaS)
- EC2 instances (inside Auto Scaling Group)
- Application Load Balancer
- Amazon RDS (MySQL)
- VPC, Subnets, Security Groups
- CloudWatch (Logs & Monitoring)
- S3 (for deployment artifacts and logs)

## Conclusion
Successfully deployed a scalable Node.js CRUD application using AWS Elastic Beanstalk with an external RDS MySQL database.  
All infrastructure (EC2 instances, Auto Scaling, Load Balancing, networking, monitoring) is completely managed by Elastic Beanstalk — you only manage your application code and database connection.

**Project demonstrates**: How Platform-as-a-Service (PaaS) simplifies deployment, management, and scaling by fully abstracting infrastructure.
