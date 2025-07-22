# 🌡️ D3 Heat Map – Global Land-Surface Temperatures

An interactive heat map built with **D3.js**, visualizing monthly global land-surface temperature variance from 1753 to 2015.

Data is sourced from [freeCodeCamp's public dataset](https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json).

---

## 🚀 Features

- 📅 **Years** displayed along the X-axis and **Months** on the Y-axis
- 🎨 Cells colored by temperature variance using a quantized color scale
- 📌 Hover tooltip shows year, month, actual temperature, and variance
- 🧠 Passes all **freeCodeCamp D3 heat map project tests**
- 📱 Fully responsive and mobile-friendly

---

## 🖼️ Demo

<img width="811" height="661" alt="Image" src="https://github.com/user-attachments/assets/ff9918b4-fd0b-4da2-9026-5c6a6a9b8003" />

---

## 📦 Technologies Used

- [D3.js](https://d3js.org/) – for rendering SVG, axes, tooltips, and legends
- HTML5 & CSS3
- JavaScript (ES6+)
- Fetch API – to retrieve the temperature dataset

---

## 🛠️ How to Run Locally

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/d3-heat-map.git
   cd d3-heat-map
   ```

<pre> 
├── index.html # Main HTML file 
├── styles.css # App styling (responsive, accessible) 
├── script.js # D3 logic: chart, scales, tooltips, legend 
├── README.md # This file 
</pre>

🔮 Future Improvements
Add year-range filter for zooming

Add temperature scale animation

Improve accessibility with ARIA labels

Mobile tooltip optimization (touch interaction)

👨‍💻 Author
Denys Lysenko
GitHub: @LysenkoDenys

📄 License
MIT — Feel free to use, share, and modify.
