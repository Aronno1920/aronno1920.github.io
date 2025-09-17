document.addEventListener("DOMContentLoaded", () => {
  fetch("./data/testimonials.json")
    .then((res) => res.json())
    .then((testimonials) => renderTestimonials(testimonials))
    .catch((err) => console.error("Failed to load testimonials:", err));
});

function renderTestimonials(testimonials) {
  const container = document.getElementById("testimonials-list");
  if (!container) {
    console.error("❌ testimonials-list container not found in HTML");
    return;
  }

  container.innerHTML = ""; // Clear before rendering

  testimonials.forEach((t) => {
    const li = document.createElement("li");
    li.className = "testimonials-item";

    li.innerHTML = `
      <div class="content-card" data-testimonials-item>
        <figure class="testimonials-avatar-box">
          <img src="${t.avatar.src}" 
               alt="${t.avatar.alt}" 
               width="${t.avatar.width}" 
               data-testimonials-avatar />
        </figure>
        <h4 class="h4 testimonials-item-title" data-testimonials-title>
          ${t.name}
        </h4>
        <p hidden data-testimonials-position>${t.position}</p>
        <div class="testimonials-text" data-testimonials-text>
          <p>${t.text}</p>
        </div>
      </div>
    `;

    container.appendChild(li);
  });

  // ✅ Re-run testimonialsHandler after injecting new items
  if (typeof testimonialsHandler === "function") {
    testimonialsHandler();
  }
}


function enableTestimonialsDelegation() {
  const container = document.getElementById("testimonials-list");
  if (!container) return;

  container.addEventListener("click", function (e) {
    const item = e.target.closest(".testimonials-item");
    if (!item) return;

    const avatar = item.querySelector("[data-testimonials-avatar]");
    const title = item.querySelector("[data-testimonials-title]");
    const position = item.querySelector("[data-testimonials-position]");
    const text = item.querySelector("[data-testimonials-text]");

    DOM.modalImg.src = avatar.src;
    DOM.modalImg.alt = avatar.alt;
    DOM.modalTitle.innerHTML = title.innerHTML;
    DOM.modalPosition.innerHTML = position.innerHTML;
    DOM.modalText.innerHTML = text.innerHTML;

    DOM.modalContainer.classList.add("active");
    DOM.overlay.classList.add("active");
  });

  DOM.modalCloseBtn.addEventListener("click", () => {
    DOM.modalContainer.classList.remove("active");
    DOM.overlay.classList.remove("active");
  });

  DOM.overlay.addEventListener("click", () => {
    DOM.modalContainer.classList.remove("active");
    DOM.overlay.classList.remove("active");
  });
}
