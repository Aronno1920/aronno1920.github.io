document.addEventListener("DOMContentLoaded", async () => {
  const testimonials = await fetchTestimonials();
  if (!testimonials) return;

  const aboutPage = document.querySelector('article.about.active[data-page="about"]');
  if (!aboutPage) return;

  const list = aboutPage.querySelector(".testimonials-list");
  if (!list) return;

  renderTestimonials(testimonials, list);

  // Initialize scrolling and modal functionality
  initializeSlider(aboutPage, list);
  initializeModal(list);
});

async function fetchTestimonials() {
  try {
    const response = await fetch("./data/testimonials.json");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to load testimonials:", error);
    return null;
  }
}

function renderTestimonials(testimonials, container) {
  container.innerHTML = testimonials.map(testimonial => {
    return `
      <li class="testimonials-item">
        <div class="content-card" data-testimonial-id="${testimonial.id}">
          <figure class="testimonials-avatar-box">
            <img 
              src="${testimonial.avatar.src}" 
              alt="${testimonial.avatar.alt}" 
              width="${testimonial.avatar.width}" 
              data-testimonials-avatar
            />
          </figure>
          <h4 class="h4 testimonials-item-title" data-testimonials-title>${testimonial.name}</h4>
          <p hidden data-testimonials-fullname>${testimonial.fullName}</p>
          <p hidden data-testimonials-position>${testimonial.position}</p>
          <div class="testimonials-text" data-testimonials-text>
            <p>${testimonial.text}</p>
          </div>
        </div>
      </li>
    `;
  }).join('');
}

function initializeSlider(aboutPage, list) {
  const wrapper = aboutPage.querySelector(".testimonials-wrapper");
  const items = list.querySelectorAll(".testimonials-item");
  const itemsPerView = 2;
  const totalItems = items.length;
  let currentIndex = 0;

  if (totalItems <= itemsPerView) return;

  const slideTestimonials = () => {
    // Get the full width of a single item
    const singleItemWidth = items[0].offsetWidth;

    // Get the computed gap from the parent container
    const listStyle = window.getComputedStyle(list);
    const listGap = parseFloat(listStyle.gap);

    // The total width to scroll is the item's width plus half of the gap
    // because two items share one gap.
    const totalItemWidth = singleItemWidth + listGap;

    if (currentIndex >= totalItems - itemsPerView) {
      currentIndex = 0;
    } else {
      currentIndex++;
    }

    const offset = currentIndex * totalItemWidth;
    list.style.transform = `translateX(-${offset}px)`;
  };

  setInterval(slideTestimonials, 3000);
}

// function initializeSlider(aboutPage, list) {
//   const items = list.querySelectorAll(".testimonials-item");
//   const itemsPerView = 2;
//   const totalItems = items.length;
//   let currentIndex = 0;

//   if (totalItems <= itemsPerView) return;

//   const slideTestimonials = () => {
//     // Get the full width of a single item, including its content and padding.
//     const singleItemWidth = items[0].offsetWidth;
    
//     // Get the computed margin or gap between items.
//     // The getComputedStyle() method is the most reliable way to get this value.
//     const itemStyle = window.getComputedStyle(items[0]);
//     const itemMarginRight = parseFloat(itemStyle.marginRight); // Use parseFloat to convert the string to a number
    
//     // Calculate the total width to move, which is the item width + margin.
//     const totalItemWidth = singleItemWidth + itemMarginRight;

//     // Check if we've reached the end of the scrollable items
//     if (currentIndex >= totalItems - itemsPerView) {
//       currentIndex = 0; // Reset to the beginning
//     } else {
//       currentIndex++; // Increment index
//     }

//     const offset = currentIndex * totalItemWidth;
//     list.style.transform = `translateX(-${offset}px)`;
//   };

//   setInterval(slideTestimonials, 3000); // 3-second interval for sliding
// }


function initializeModal(container) {
  const modal = document.querySelector(".modal-container");
  const overlay = document.querySelector(".overlay");
  const modalCloseBtn = document.querySelector("[data-modal-close-btn]");

  if (!modal || !overlay || !modalCloseBtn) return;

  container.addEventListener("click", (event) => {
    const item = event.target.closest("[data-testimonial-id]");
    if (!item) return;
    
    // In a real app, you would fetch data by ID. For now, we'll
    // get it from the rendered HTML.
    const avatar = item.querySelector("[data-testimonials-avatar]");
    const fullname = item.querySelector("[data-testimonials-fullname]");
    const position = item.querySelector("[data-testimonials-position]");
    const text = item.querySelector("[data-testimonials-text]");
    
    // Populate modal with content
    const modalImg = modal.querySelector("[data-modal-img]");
    const modalTitle = modal.querySelector("[data-modal-title]");
    const modalPosition = modal.querySelector("[data-modal-position]");
    const modalText = modal.querySelector("[data-modal-text]");

    if (modalImg && avatar) {
      modalImg.src = avatar.src;
      modalImg.alt = avatar.alt;
    }
    if (modalTitle && fullname) {
      modalTitle.textContent = fullname.textContent;
    }
    if (modalPosition && position) {
      modalPosition.textContent = position.textContent;
    }
    if (modalText && text) {
      modalText.innerHTML = text.innerHTML;
    }

    modal.classList.add("active");
    overlay.classList.add("active");
  });

  const closeModal = () => {
    modal.classList.remove("active");
    overlay.classList.remove("active");
  };

  modalCloseBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", closeModal);
}