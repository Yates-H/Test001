# BYD DM-i vs Fuel Car Cost Calculator

A responsive web application that allows users in Indonesia to quickly compare the usage costs between BYD DM-i vehicles and traditional fuel cars by scanning a QR code.

## Features

- **Cost Comparison**: Calculate and compare monthly usage costs between BYD DM-i and fuel cars
- **Customizable Parameters**: Adjust fuel price, electricity price, mileage, consumption rates, etc.
- **Visual Charts**: Interactive charts showing cost comparison and savings
- **Multi-language Support**: Indonesian (default) and English
- **QR Code Generation**: Generate QR code for easy sharing and access
- **Responsive Design**: Works on mobile, tablet, and desktop devices

## Technology Stack

- **HTML5**: Semantic markup and structure
- **CSS3**: Responsive design with Flexbox/Grid
- **JavaScript (ES6+)**: Core logic and interactivity
- **Chart.js**: Data visualization
- **QRCode.js**: QR code generation

## Project Structure

```
byd-dmi-cost-calculator/
├── index.html                    # Main HTML file
├── style.css                     # Main CSS file
├── script.js                     # Main JavaScript file
├── assets/                       # Static resources
│   ├── images/                   # Image assets
│   ├── icons/                    # Icon assets
│   └── fonts/                    # Font files
├── locales/                      # Language files
│   ├── en.json                   # English translations
│   └── id.json                   # Indonesian translations
├── lib/                          # Third-party libraries
│   ├── chart.js                  # Chart.js library
│   └── qrcode.min.js             # QRCode.js library
└── README.md                     # This file
```

## Cost Calculation Formulas

### Fuel Car Cost
```
Fuel Car Cost = (Monthly Distance ÷ 100) × Fuel Consumption × Fuel Price
```

### BYD DM-i Cost
```
DM-i Cost = Electric Cost + Hybrid Fuel Cost
Electric Cost = (Monthly Distance ÷ 100) × Electric Consumption × Electricity Price
Hybrid Fuel Cost = (Monthly Distance × Hybrid Ratio ÷ 100) × DM-i Fuel Consumption × Fuel Price
```

### Savings
```
Savings Amount = Fuel Car Cost - DM-i Cost
Savings Percentage = (Savings Amount ÷ Fuel Car Cost) × 100%
```

## Default Parameters (Indonesia Market)

| Parameter | Value | Unit |
|-----------|-------|------|
| Fuel Price | 15,000 | IDR/L |
| Electricity Price | 1,500 | IDR/kWh |
| Monthly Distance | 1,500 | km/month |
| Fuel Car Consumption | 8 | L/100km |
| DM-i Electric Consumption | 15 | kWh/100km |
| DM-i Fuel Consumption | 5 | L/100km (hybrid mode) |
| Hybrid Ratio | 30 | % |

## Getting Started

### Local Development

1. Clone or download this project
2. Open `index.html` in a web browser
3. Or use a local HTTP server:
   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js (if you have http-server installed)
   npx http-server
   ```

### Deployment

This is a static website that can be deployed to any static hosting service:

- **GitHub Pages**: Push to a GitHub repository and enable Pages
- **Netlify**: Drag and drop the folder or connect to Git repository
- **Vercel**: Import Git repository
- **AWS S3**: Upload files to an S3 bucket with static website hosting enabled

## Usage

1. **Access the Calculator**: Open the webpage or scan the QR code
2. **Adjust Parameters**: Modify the input values based on your situation
3. **Calculate**: Click the "Calculate" button to see results
4. **View Charts**: See visual comparison of costs
5. **Switch Language**: Toggle between Indonesian and English
6. **Share**: Use the generated QR code to share with others

## Customization

### Adding New Languages

1. Create a new JSON file in the `locales/` directory (e.g., `fr.json`)
2. Add translations following the same structure as existing files
3. Update the language switcher in `index.html`
4. Update the language loading logic in `script.js`

### Modifying Default Parameters

Edit the `defaultParams` object in `script.js` to change default values.

### Changing Brand Colors

Modify the CSS variables in `style.css` to match your brand colors:

```css
:root {
    --primary-color: #1E5128;    /* Dark green */
    --secondary-color: #4E9F3D;  /* Light green */
    --accent-color: #D8E9A8;     /* Light accent */
    --text-color: #333333;       /* Dark text */
    --background-color: #F5F5F5; /* Light background */
}
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+
- iOS Safari 11+
- Android Chrome 60+

## Performance

- All third-party libraries are hosted locally
- Images are optimized for web
- CSS and JavaScript are minified for production
- Responsive images and lazy loading where applicable

## License

This project is created for educational and demonstration purposes.

## Disclaimer

The cost calculations are estimates based on the provided parameters. Actual costs may vary based on driving habits, vehicle condition, fuel quality, electricity rates, and other factors. Always consult with automotive professionals for accurate cost assessments.

## Contact

For questions or feedback, please contact the development team.

---

**Made with ❤️ for BYD Indonesia**