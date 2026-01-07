# Hướng dẫn Tailwind CSS cho Hotel Booking Project

## Tổng quan
Dự án đã được chuyển đổi sang sử dụng **Tailwind CSS v4** để style toàn bộ giao diện.

## Cấu hình

### 1. Dependencies đã cài đặt
```json
{
  "tailwindcss": "^4.1.18",
  "@tailwindcss/vite": "^4.1.18"
}
```

### 2. Vite Config
File `vite.config.js` đã được cấu hình với plugin Tailwind:
```javascript
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

### 3. CSS Config
File `src/index.css` chứa cấu hình Tailwind và custom classes:
```css
@import "tailwindcss";

@layer base {
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground;
  }
}

@layer components {
  .btn-primary {
    @apply bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200;
  }
  
  .card {
    @apply bg-white rounded-xl shadow-lg p-6;
  }
  
  .input-field {
    @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none;
  }
}
```

## Components đã được styled

### ✅ Hoàn thành
- **HomePage** - Hero section, services grid
- **Navbar** - Sticky navigation với responsive design
- **Footer** - Dark theme footer
- **LoginPage** - Modern form với gradient background
- **RegisterPage** - Modern form với validation
- **AllRoomsPage** - Grid layout cho rooms
- **RoomSearch** - Date picker integration
- **RoomResult** - Room cards
- **RoomDetailsPage** - Detailed view với booking form
- **FindBookingPage** - Search và display booking details
- **ProfilePage** - User profile với booking history
- **EditProfile** - Profile editing form
- **Pagination** - Modern pagination buttons
- **AdminPage** - Dashboard với cards

## Color Scheme

### Primary Colors
- **Blue**: `blue-600` (primary), `blue-700` (hover)
- **Gray**: `gray-50` (bg), `gray-800` (text dark)
- **Red**: `red-500` (danger), `red-600` (hover)
- **Green**: `green-600` (success), `green-700` (hover)
- **Yellow**: `yellow-500` (warning)

### Common Patterns
```jsx
// Buttons
className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"

// Cards
className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300"

// Input Fields
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"

// Containers
className="container mx-auto px-4 py-8"

// Grid Layouts
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
```

## Responsive Design

### Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Example Usage
```jsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
```

## Animations

### Custom Animations
Được định nghĩa trong `App.css`:
```css
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out;
}
```

### Tailwind Built-in
- `transition-colors` - Color transitions
- `transition-shadow` - Shadow transitions
- `duration-200` - 200ms duration
- `hover:scale-105` - Scale on hover
- `transform` - Enable transforms

## Best Practices

1. **Container Usage**
   ```jsx
   <div className="container mx-auto px-4">
     {/* Content */}
   </div>
   ```

2. **Responsive Images**
   ```jsx
   <img className="w-full h-48 object-cover rounded-lg" />
   ```

3. **Spacing**
   - Sử dụng `space-y-{n}` cho vertical spacing
   - Sử dụng `gap-{n}` trong grid/flex

4. **Hover Effects**
   ```jsx
   className="hover:shadow-2xl transition-shadow duration-300"
   ```

## Chạy Development Server

```bash
npm run dev
```

## Build for Production

```bash
npm run build
```

## Lưu ý
- Tailwind CSS v4 đã được tích hợp sẵn với Vite
- Không cần file `tailwind.config.js` riêng với v4
- Custom styles nên được thêm vào `index.css` sử dụng `@layer`
- Tất cả CSS cũ đã được thay thế bằng Tailwind classes
