document.addEventListener("DOMContentLoaded", () => {
  fetch("./data/services.json")
    .then((res) => res.json())
    .then((services) => renderServices(services))
    .catch((err) => console.error("Failed to load services:", err));
});

function renderServices(services) {
  const container = document.getElementById("service-list");
  container.innerHTML = ""; // Clear previous

  services.forEach((service) => {
    const li = document.createElement("li");
    li.className = "service-item";

    li.innerHTML = `
      <div class="service-icon-box">
        <img src="${service.icon.src}" 
             alt="${service.icon.alt}" 
             width="${service.icon.width}" />
      </div>
      <div class="service-content-box">
        <h4 class="h4 service-item-title">${service.title}</h4>
        <p class="service-item-text">
          ${service.description}
        </p>
      </div>
    `;

    container.appendChild(li);
  });
}
