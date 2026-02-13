# Multi-Tenant School Management System - Frontend

A comprehensive multi-tenant SaaS school management system with support for multiple schools, RTL languages (Arabic), and subscription-based features.

## 🌟 Features

- ✅ **Multi-Tenant Architecture** - Each school has isolated data and branding
- ✅ **School Selection** - Users can belong to multiple schools and switch between them
- ✅ **Custom Branding** - Each school can customize logo, colors, and theme
- ✅ **RTL Support** - Full right-to-left layout for Arabic language
- ✅ **Multi-Language** - English and Arabic translations
- ✅ **Subscription Tiers** - FREE, BASIC, PREMIUM, ENTERPRISE plans
- ✅ **Feature Gates** - Features are enabled/disabled based on subscription
- ✅ **Admin Panel** - Manage users, settings, billing, and branding
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm
- Backend server running (see backend README)

### Install Dependencies

```bash
cd frontend
npm install
```

### Required Additional Dependencies

If not already installed, add these dependencies:

```bash
npm install lucide-react
```

## 🚀 Running the Application

### Development Mode

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm install -g serve
serve -s build
```

## 📁 Project Structure

```
frontend/src/
├── pages/
│   ├── auth/                  # Authentication pages
│   │   ├── LoginPage.tsx      # Login with school selection
│   │   └── RegisterPage.tsx   # Register new school
│   ├── dashboard/             # Dashboard pages
│   │   └── DashboardPage.tsx  # Main dashboard
│   └── admin/                 # Admin pages
│       └── AdminPanel.tsx     # Admin panel with tabs
├── components/
│   ├── layout/                # Layout components
│   │   ├── Layout.tsx         # Main layout wrapper
│   │   ├── Navbar.tsx         # Top navigation bar
│   │   ├── Sidebar.tsx        # Side navigation
│   │   ├── LanguageSwitcher.tsx
│   │   └── SchoolSwitcher.tsx
│   ├── school/                # School-specific components
│   │   ├── FeatureGate.tsx    # Feature access control
│   │   ├── SubscriptionBadge.tsx
│   │   ├── SchoolBranding.tsx
│   │   └── SchoolLogo.tsx
│   └── common/                # Reusable components
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Loading.tsx
├── context/                   # React Context providers
│   ├── SchoolContext.tsx      # School state management
│   └── LanguageContext.tsx    # Language & RTL management
├── types/                     # TypeScript types
│   ├── school.ts
│   └── subscription.ts
├── styles/                    # CSS files
│   ├── rtl.css               # RTL support styles
│   └── school-branding.css   # School branding styles
└── App.tsx                    # Main app component
```

## 🏫 Multi-Tenant Features

### School Selection Flow

1. User logs in with email/password
2. If user belongs to multiple schools, a selection screen appears
3. User selects their school
4. School context is set and branding is applied
5. User is redirected to dashboard

### School Branding

Each school can customize:
- **Logo** - Displayed in navbar and login
- **Primary Color** - Main brand color
- **Secondary Color** - Supporting color
- **Accent Color** - Highlights and CTAs

Branding is applied via CSS variables in `SchoolContext`.

### Subscription Tiers

| Feature | FREE | BASIC | PREMIUM | ENTERPRISE |
|---------|------|-------|---------|------------|
| Max Students | 50 | 200 | 1000 | Unlimited |
| Max Teachers | 10 | 50 | 200 | Unlimited |
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Attendance | ✅ | ✅ | ✅ | ✅ |
| Courses | Basic | ✅ | ✅ | ✅ |
| Assignments | ❌ | ✅ | ✅ | ✅ |
| Messaging | ❌ | ✅ | ✅ | ✅ |
| Reports | ❌ | ❌ | ✅ | ✅ |
| Analytics | ❌ | ❌ | ✅ | ✅ |
| API Access | ❌ | ❌ | ✅ | ✅ |
| Custom Integration | ❌ | ❌ | ❌ | ✅ |

## 🌍 Multi-Language & RTL

### Language Switcher

Users can switch between English and Arabic using the language switcher in the navbar.

### RTL Layout

When Arabic is selected:
- Layout switches to right-to-left
- Sidebar moves to the right
- Text alignment changes
- All spacing and margins are mirrored

### Adding Translations

Translations are managed in the `LanguageContext`. To add more:

1. Update language options in `LanguageContext.tsx`
2. Add translation strings in components
3. Update RTL CSS if needed for new language

## 🎨 Customization

### Adding New School Features

1. **Define Feature** - Add to `FEATURE_MATRIX` in `types/subscription.ts`
2. **Gate Component** - Wrap with `<FeatureGate feature="feature-name">`
3. **Update Plans** - Add to subscription plan definitions

Example:
```tsx
<FeatureGate feature="advanced_reports">
  <AdvancedReportsComponent />
</FeatureGate>
```

### Customizing Colors

Default colors in `styles/school-branding.css`:
```css
:root {
  --school-primary: #1e40af;
  --school-secondary: #64748b;
  --school-accent: #f59e0b;
}
```

These are overridden when a school is selected via `SchoolContext`.

## 🔐 Authentication Flow

1. **Login** - `POST /api/auth/login`
2. **Get Schools** - Returns list of user's schools
3. **Select School** - `POST /api/auth/select-school`
4. **Get Token** - Receive JWT with school context
5. **Store** - Token and school saved to localStorage

## 📱 Responsive Design

The app is fully responsive:
- **Desktop** (1024px+) - Full layout with sidebar
- **Tablet** (768px-1023px) - Adapted layout
- **Mobile** (<768px) - Stacked layout, collapsible sidebar

## 🧪 Testing

```bash
npm test
```

## 📝 Environment Variables

Create a `.env` file in frontend folder:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_NAME=School Management System
```

## 🚧 TODO / Future Enhancements

- [ ] Add i18n library (react-i18next) for better translation management
- [ ] Implement actual API integration (currently using mock data)
- [ ] Add authentication guards (ProtectedRoute component)
- [ ] Implement user profile management
- [ ] Add dark mode support
- [ ] Implement real-time notifications
- [ ] Add file upload for school logo
- [ ] Implement invoice generation
- [ ] Add payment gateway integration
- [ ] Create mobile app (React Native)

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues or questions:
- Create an issue on GitHub
- Email: support@yourschool.com
- Documentation: [link to docs]

## 👥 Authors

- Your Name - Initial work

---

Built with ❤️ for modern schools worldwide
