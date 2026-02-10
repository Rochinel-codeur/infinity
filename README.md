# Preuve Sociale Landing Page

This is a Next.js application designed as a landing page to showcase social proof (testimonials, video proofs, WhatsApp screenshots) and drive user registration. It includes an administration panel for managing content, users, and push notifications.

## Features

*   **Next.js Framework:** Modern React framework for server-side rendering (SSR) and static site generation (SSG).
*   **Prisma ORM:** Type-safe database access with SQLite (development) and potentially PostgreSQL/MySQL (production).
*   **Authentication:** Admin authentication using JWTs and bcryptjs for secure password handling.
*   **Admin Panel:**
    *   Manage testimonials (create, edit, publish/unpublish).
    *   Manage video proofs.
    *   Manage WhatsApp winning screenshots for social proof.
    *   User management.
    *   Analytics dashboard (real-time metrics, conversion funnel, device/browser stats, hourly activity).
    *   Push Notification management (send broadcasts, view history).
    *   Site settings (promo codes, applied user count).
*   **Push Notifications:** Web Push notifications for broadcasting messages to subscribed users.
*   **Social Proof Elements:**
    *   Dynamic testimonials display.
    *   Marquee of winning screenshots.
    *   Live visitor count.
*   **Promo Code Integration:** Display and track promo code usage.
*   **Responsive Design:** Built with Tailwind CSS for a modern and adaptive user interface.

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

*   Node.js (v18 or higher)
*   npm or Yarn
*   Git

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/preuve-sociale-landing.git
    cd preuve-sociale-landing
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    Copy the `.env.example` file to `.env` and fill in the necessary values.

    ```bash
    cp .env.example .env
    ```

    Ensure you have the following in your `.env` file:
    ```
    # Database Configuration
    DATABASE_URL="file:./dev.db" # For SQLite in development

    # JWT Secret for admin authentication
    JWT_SECRET="your_jwt_secret_key"

    # VAPID keys for Web Push Notifications (generate these using the script below)
    NEXT_PUBLIC_VAPID_PUBLIC_KEY="your_vapid_public_key"
    VAPID_PRIVATE_KEY="your_vapid_private_key"

    # Public variables (can be prefixed with NEXT_PUBLIC_)
    NEXT_PUBLIC_SITE_URL="http://localhost:3000"
    NEXT_PUBLIC_VIDEO_SRC="/media/demo.mp4"
    NEXT_PUBLIC_VIDEO_POSTER="/assets/poster.jpg"
    NEXT_PUBLIC_APPLIED_COUNT="15000"
    NEXT_PUBLIC_ENABLE_COPY_TRACKING="1" # Set to 1 to enable tracking for promo code copies
    ```

4.  **Generate VAPID Keys:**
    You need to generate VAPID keys for push notifications. Run the following script:
    ```bash
    node scripts/generate-vapid.js
    ```
    This will output `NEXT_PUBLIC_VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY`. Copy these values and add them to your `.env` file.

5.  **Initialize Prisma and migrate the database:**
    ```bash
    npx prisma migrate dev --name init # Follow prompts to initialize
    npx prisma db seed # (If you have a seed script)
    ```

6.  **Create a default admin user (optional, but recommended for admin panel access):**
    ```bash
    node scripts/create-admin.js
    ```
    Follow the prompts to create your admin user credentials.

### Running the Development Server

To start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Production with Nginx

This section outlines steps for deploying your Next.js application to a production server using Nginx as a reverse proxy.

### 1. Build the Application

First, build your Next.js application for production:

```bash
npm run build
# or
yarn build
```

This command creates an optimized production build in the `.next` directory.

### 2. Install Dependencies for Production

On your production server, ensure Node.js and npm/yarn are installed. Copy your project files and install only production dependencies:

```bash
cd /path/to/your/project
npm install --production
# or
yarn install --production
```

### 3. Environment Variables

Ensure your production `.env` file is correctly configured with:

*   `NODE_ENV=production`
*   Your actual `DATABASE_URL` (e.g., PostgreSQL, MySQL connection string).
*   Strong `JWT_SECRET`.
*   Generated `NEXT_PUBLIC_VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY`.
*   Correct `NEXT_PUBLIC_SITE_URL` pointing to your domain.

### 4. Running the Next.js Application

Use a process manager like PM2 to keep your Next.js application running continuously and automatically restart it if it crashes.

1.  **Install PM2 (if not already installed):**
    ```bash
    npm install -g pm2
    ```

2.  **Start your Next.js application with PM2:**
    ```bash
    cd /path/to/your/project
    pm2 start npm --name "nextjs-app" -- start
    ```
    This command tells PM2 to run `npm start`, which executes `next start` as defined in your `package.json`.

3.  **Configure PM2 to start on boot:**
    ```bash
    pm2 startup
    pm2 save
    ```
    Follow the instructions provided by `pm2 startup` to configure it for your specific operating system.

### 5. Nginx Installation & Configuration

Nginx will serve as a reverse proxy, directing external requests to your Next.js application and handling static file serving.

1.  **Install Nginx (e.g., on Ubuntu/Debian):**
    ```bash
    sudo apt update
    sudo apt install nginx
    ```

2.  **Configure Nginx:**
    Create a new Nginx server block configuration file (e.g., `/etc/nginx/sites-available/your_domain.conf`):

    ```nginx
    server {
        listen 80;
        server_name your_domain.com www.your_domain.com; # Replace with your domain

        location /_next/static/ {
            # Serve static Next.js assets directly
            alias /path/to/your/project/.next/static/;
            expires 1y;
            access_log off;
            add_header Cache-Control "public, immutable";
        }

        location /static/ {
            # Serve other static assets if any
            alias /path/to/your/project/public/static/; # Adjust if your static files are elsewhere
            expires 1y;
            access_log off;
            add_header Cache-Control "public, immutable";
        }

        location /uploads/ {
            # Serve user-uploaded content directly
            alias /path/to/your/project/public/uploads/;
            expires 30d;
            access_log off;
            add_header Cache-Control "public";
        }
        
        location / {
            # Proxy all other requests to the Next.js application
            proxy_pass http://localhost:3000; # Next.js app listens on port 3000 by default
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
    ```
    **Important:** Replace `your_domain.com` and `/path/to/your/project/` with your actual domain and project path.

3.  **Enable the Nginx configuration:**
    ```bash
    sudo ln -s /etc/nginx/sites-available/your_domain.conf /etc/nginx/sites-enabled/
    sudo nginx -t # Test Nginx configuration for syntax errors
    sudo systemctl restart nginx
    ```

### 6. Configure Firewall

Ensure your firewall allows HTTP (port 80) and HTTPS (port 443) traffic.

```bash
sudo ufw allow 'Nginx HTTP'
sudo ufw allow 'Nginx HTTPS' # If you plan to set up SSL/TLS
sudo ufw enable
```

### 7. Setup SSL/TLS (HTTPS)

It is highly recommended to secure your production site with SSL/TLS. Certbot is a popular tool for automating this with Let's Encrypt.

1.  **Install Certbot:**
    ```bash
    sudo apt install certbot python3-certbot-nginx
    ```

2.  **Run Certbot:**
    ```bash
    sudo certbot --nginx -d your_domain.com -d www.your_domain.com
    ```
    Follow the prompts. Certbot will automatically configure Nginx for HTTPS.

3.  **Test automatic renewal:**
    ```bash
    sudo certbot renew --dry-run
    ```

Your Next.js application should now be accessible via your domain over HTTPS.
