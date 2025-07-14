
# Living Rock CMS

## Monorepo Structure (Frontend/Backend Separation)

- `/frontend` — React app (UI, state, API calls)
- `/backend` — Node.js/Express API (custom endpoints, business logic, integrations)
- `/supabase` — Database migrations, SQL, and Supabase config

### Migration Steps
1. Move all files and folders from `src/` and `public/` into a new `/frontend` folder.
2. Initialize a new `/backend` folder for your Node.js/Express API (see below for starter code).
3. Keep `/supabase` for your database migrations and SQL logic.

---

# ⛪ Living Rock CMS

**Living Rock CMS** is a modern, responsive, and role-based Church Management System designed to support the operations and spiritual growth of a church community. Inspired by the professional design and color palette of [Xiracom.co.ke](https://xiracom.co.ke), it provides a seamless experience for members, clergy, and administrators.

---

## ✨ Features

### 🙋 Member Dashboard
- View and update personal profile
- Track spiritual journey (baptism, marriage, dedication)
- Join and manage ministry groups
- RSVP for events and services

### 🎫 Events & Services
- View upcoming events and services
- Register attendance and receive notifications
- Access past event history and notes

### 💒 Giving & Donations
- Tithing, offerings, and fundraising donations
- Online payment integration (Mobile Money, Card)
- Track giving history and download statements
- Pledge tracking

### 📖 Sermons & Resources
- Access sermon audio and video
- Download devotionals and church publications
- Search by theme, speaker, or date

### 👥 Ministries & Volunteering
- Join ministry teams (Choir, Youth, Men, Women, etc.)
- Volunteer for church duties
- View personal duty roster

### 🔔 Announcements & Messaging
- Central church bulletin
- Real-time SMS/Email notifications
- Direct messages from clergy or group leaders

### 🧑‍💼 Role-Based Access
- Member, Treasurer, Secretary, Clergy, and Admin dashboards
- Each role has dedicated modules and permissions

---

## 🖥️ Tech Stack

- **Frontend:** React.js + Tailwind CSS
- **Backend:** Node.js + Express *(or Laravel optional)*
- **Database:** PostgreSQL / MongoDB
- **Authentication:** JWT & Role-based access control
- **APIs:** Email & SMS Gateway support

---

## 🎨 UI & Design System

- Modern, clean, mobile-first layout
- Theme and color palette based on [Xiracom.co.ke](https://xiracom.co.ke)
- Dark/Light mode toggle
- Consistent card-based UI with elegant typography

---

## 🚀 Getting Started

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/living-rock-cms.git
   cd living-rock-cms
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   - Create `.env` from `.env.example`
   - Add your DB credentials, JWT secret, Email/SMS API keys

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   ```

---

## 📸 Screenshots

*(Insert screenshots or screen recordings of the system here)*

---

## 📚 Documentation

- System Architecture
- API Reference
- Admin Manual
- User Manual

---

## 🤝 Contributing

Pull requests are welcome. Please open an issue to discuss improvements or major features before submitting a PR.

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgements

- UI inspiration from [Xiracom.co.ke](https://xiracom.co.ke)
- Icon set: [Lucide](https://lucide.dev/)
- Optional integrations: [Africa's Talking](https://africastalking.com/), [Twilio](https://www.twilio.com/), [Firebase](https://firebase.google.com/)
