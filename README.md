# Food Ordering PWA 🍽️

A mobile-first Progressive Web App (PWA) for food ordering built with React. This app provides a complete food ordering experience with mobile number authentication, cart management, delivery address selection, and admin panel for order management.

## ✨ Features

### Customer Features
- **📱 Mobile Number Login**: Simple authentication with mobile number (no OTP required)
- **🍔 Food Menu**: Grid-based food items display with images, prices, and veg/non-veg indicators
- **🛒 Cart Management**: Add/remove items with quantity controls
- **💰 Checkout**: Review order with itemized pricing, GST, and delivery charges
- **🏠 Delivery Address**: Select from predefined flats or enter custom address
- **📦 Order Tracking**: View order status and history

### Admin Features
- **🔐 Admin Panel**: Secure admin login (password: admin123)
- **📋 Order Management**: View all orders with customer details
- **🖨️ PetPooja Integration**: Print orders with delivery address in notes
- **📊 Order Statistics**: Dashboard with order counts and revenue
- **✅ Status Updates**: Mark orders as confirmed/delivered

### PWA Features
- **📱 Mobile-First Design**: Optimized for mobile devices
- **⚡ Offline Support**: Service worker for caching
- **🏠 Installable**: Can be installed on mobile home screen
- **🎨 Native Feel**: App-like experience with custom theme

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm start
   ```

3. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Login.js          # Mobile number authentication
│   ├── Home.js           # Food menu and cart
│   ├── Checkout.js       # Order review and totals
│   ├── DeliveryAddress.js # Address selection
│   └── Admin.js          # Admin panel
├── data/
│   ├── menuItems.json    # Static food menu data
│   └── flats.json        # Predefined delivery locations
├── App.js                # Main app component with routing
├── App.css               # Mobile-first responsive styles
└── index.js              # App entry point with PWA setup
```

## 🎯 User Flow

1. **Login**: Enter 10-digit mobile number
2. **Browse Menu**: View food items in responsive grid
3. **Add to Cart**: Select items with quantity controls
4. **Checkout**: Review order and pricing
5. **Select Address**: Choose from flats list or enter custom
6. **Place Order**: Confirm and submit order
7. **Admin Processing**: Admin receives order and prints via PetPooja

## 🔧 Configuration

### Menu Items
Edit `src/data/menuItems.json` to modify food items:
```json
{
  "id": 1,
  "name": "Chicken Biryani",
  "price": 250,
  "category": "Main Course",
  "isVeg": false,
  "isAvailable": true
}
```

### Delivery Locations
Edit `src/data/flats.json` to modify delivery areas:
```json
{
  "id": 1,
  "name": "Green Valley Apartments",
  "address": "Block A, Green Valley, Sector 12"
}
```

## 🛠️ Technical Details

### Technologies Used
- **React 19**: Frontend framework
- **React Router**: Client-side routing
- **CSS Grid/Flexbox**: Responsive layouts
- **LocalStorage**: Data persistence
- **Service Worker**: PWA functionality

### Data Storage
- **User Data**: Stored in localStorage
- **Cart Items**: Persisted across sessions
- **Orders**: Maintained in localStorage for demo
- **Static Data**: JSON files for menu and locations

### PWA Features
- **Manifest**: App metadata and icons
- **Service Worker**: Caching and offline support
- **Responsive**: Mobile-first design
- **Installable**: Add to home screen capability

## 🎨 Design Features

- **Mobile-First**: Optimized for mobile devices
- **Responsive Grid**: Adapts to different screen sizes
- **Modern UI**: Clean, intuitive interface
- **Veg/Non-Veg Indicators**: Clear dietary preferences
- **Loading States**: User feedback during operations
- **Error Handling**: Graceful error messages

## 🔐 Admin Access

- **URL**: `/admin`
- **Password**: `admin123`
- **Features**: Order management, printing, statistics

## 📱 Mobile Experience

The app is designed mobile-first with:
- Touch-friendly buttons and controls
- Optimized typography and spacing
- Swipe-friendly navigation
- Fast loading and smooth animations
- Offline capability for core features

## 🚀 Deployment

The app can be deployed to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- Firebase Hosting

Run `npm run build` to create production build in `build/` folder.

## 🔄 Future Enhancements

- Real API integration
- Payment gateway integration
- Push notifications
- Real-time order tracking
- User profiles and order history
- Advanced admin analytics
