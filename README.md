**Student Name**: Lasith Chamika Viduranga  
**Student ID**: 20210568 | W1867208  
**Module**: 6COSC022W – Web Design & Development  
**Coursework 2** – Blogging Site For Travellers 

# TravelBloger

This project is a full-stack web application built with:
- **React.js** for the frontend
- **Node.js/Express** for the backend

It supports running via Docker (`docker-compose`) as well as manually for development purposes.

---

## 📁 Project Structure

```
project-root/
│
├── frontend/     # React App 
│   └── Dockerfile
│
├── backend/      # Node.js Backend 
│   └── Dockerfile
│
└── docker-compose.yml
```

---

##  1. Getting Started

###  Clone the Repository

```bash
git clone https://github.com/Lasith456/advancedServerSideCW2.git
cd advancedServerSideCW2
```

---

##  2. Run with Docker (Recommended)

###  Using `docker-compose` (runs both frontend & backend)

```bash
docker-compose up --build
```

- React App: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:3000](http://localhost:3000)

---

## 🔧 3. Run Without Docker (Manual Development Mode)

### Frontend (React)

```bash
cd frontend
npm install
npm run dev   

# To create production build
npm run build
```

> App runs at: [http://localhost:5173](http://localhost:5173)

---

### Backend (Node.js)

```bash
cd backend
npm install

# Run with live reload (development)
npm run dev        # using nodemon

# OR run normally
npm run start
```

> API runs at: [http://localhost:3000](http://localhost:3000)

---

## 4. Run Docker Containers Separately (Manual)

### Frontend (React)

```bash
cd frontend

# Build Docker image
docker build -t react-dev .

# Run the container
docker run -p 5173:5173 react-dev
```

### Backend (Node.js)

```bash
cd backend

# Build Docker image
docker build -t node-backend .

# Run the container
docker run -p 3000:3000 node-backend
```

---

## Environment Variables

Your backend uses environment variables defined in a .env file. An example file is provided as .env.example.
### Setup Instructions
```
cd backend
cp .env.example .env

```

---

## Scripts Reference

| Location   | Script         | Description                    |
|------------|----------------|--------------------------------|
| frontend   | `npm dev`      | Start React app (CRA)          |
| frontend   | `npm run build`| Build for production           |
| backend    | `npm run start`| Start Node.js server           |
| backend    | `npm run dev`  | Start server with nodemon      |

---

## 👨‍💻 Author

- **Lasith Chamika Viduranga**  
- GitHub: [@LasithViduranga](https://github.com/Lasith456)

---


