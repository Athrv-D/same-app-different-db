<img width="1338" height="627" alt="Screenshot 2026-04-25 181050" src="https://github.com/user-attachments/assets/5a842508-1fe7-48ea-9936-926b7c792873" />


🚀 Backend Project: Same Application Built Using Different Data Storage Approaches

I built a post-based web application and implemented it using three different data storage approaches to understand how backend systems behave with different database models.

━━━━━━━━━━━━━━━━━━━━━━━

🔹 MongoDB Version (Document-Based)

• Designed schema using embedded documents (images & comments inside post)
• Implemented CRUD operations using Mongoose
• Handled image uploads with Multer
• Used MongoDB operators like "$push", "$pull" for updating arrays
• Dynamic rendering with EJS templates
• Efficient handling of nested data structures

━━━━━━━━━━━━━━━━━━━━━━━

🔹 SQL Version (Relational Database)

• Designed normalized schema (posts table, images table, comments structure)
• Implemented one-to-many relationships using foreign keys
• Inserted and managed related data across multiple tables
• Built queries for create, update, delete, and fetch operations
• Handled image deletion using SQL DELETE queries
• Managed JSON parsing for comments where required
• Understood difference between relational vs document modeling

━━━━━━━━━━━━━━━━━━━━━━━

🔹 Local Memory Version (No Database)

• Stored data using in-memory arrays
• Focused on core backend logic without database dependency
• Implemented routing, middleware, and request handling
• Helped in understanding how backend works at a fundamental level

━━━━━━━━━━━━━━━━━━━━━━━

🔧 Core Features Across All Versions

• Create, edit, and delete posts
• Upload multiple images per post
• Upload profile pic by Default, in every user (can be edited)
• Delete individual images
• Comment system for each post
• Dynamic UI rendering using EJS
• Theme toggle using cookies (light/dark mode)
• REST-style routing (GET, POST, PATCH, DELETE)

━━━━━━━━━━━━━━━━━━━━━━━

- Key Learning

Building the same application with different data storage systems helped me in understand:

• How data modeling changes application design
• Difference between embedded vs relational data
• How backend logic adapts to database structure
• Importance of schema design in scalability

━━━━━━━━━━━━━━━━━━━━━━━

🔗 GitHub: []

#NodeJS #ExpressJS #MongoDB #SQL #BackendDevelopment #WebDevelopment
