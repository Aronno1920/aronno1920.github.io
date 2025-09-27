"use strict";

/////////// DOM Elements Cache ///////////
const DOM = {
  sidebar: document.querySelector("[data-sidebar]"),
  sidebarBtn: document.querySelector("[data-sidebar-btn]"),
  testimonialsItems: document.querySelectorAll("[data-testimonials-item]"),
  modalContainer: document.querySelector("[data-modal-container]"),
  modalCloseBtn: document.querySelector("[data-modal-close-btn]"),
  overlay: document.querySelector("[data-overlay]"),
  modalImg: document.querySelector("[data-modal-img]"),
  modalTitle: document.querySelector("[data-modal-title]"),
  modalPosition: document.querySelector("[data-modal-position]"),
  modalText: document.querySelector("[data-modal-text]"),
  select: document.querySelector("[data-select]"),
  selectItems: document.querySelectorAll("[data-select-item]"),
  selectValue: document.querySelector("[data-selecct-value]"),
  filterBtns: document.querySelectorAll("[data-filter-btn]"),
  filterItems: document.querySelectorAll("[data-filter-item]"),
  form: document.querySelector("[data-form]"),
  formInputs: document.querySelectorAll("[data-form-input]"),
  formBtn: document.querySelector("[data-form-btn]"),
  navigationLinks: document.querySelectorAll("[data-nav-link]"),
  pages: document.querySelectorAll("[data-page]"),
  blogList: document.querySelector(".blog-posts-list"),
  fullBlogContainer: document.getElementById("full-blog-container"),
  fullBlogArticle: document.getElementById("full-blog-article"),
};
//////////////////////////////////////////


/////////// Utility Functions ///////////
const utils = {
  toggleElement: (elem) => elem.classList.toggle("active"),
  debounce: (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  },
};
/////////////////////////////////////////


/////////// Sidebar Handler ///////////
const sidebarHandler = () => {
  DOM.sidebarBtn.addEventListener("click", () =>
    utils.toggleElement(DOM.sidebar)
  );
};
//////////////////////////////////////


/////////// Filter Handler ///////////
const filterHandler = () => {

  const DOM = {
    filterItems: document.querySelectorAll("[data-filter-item]"),
    filterBtns: document.querySelectorAll("[data-filter-btn]"),
    select: document.querySelector("[data-select]"),
    selectValue: document.querySelector("[data-select-value]"),
    selectItems: document.querySelectorAll("[data-select-item]")
  };

  const filterFunc = (selectedValue) => {
    DOM.filterItems.forEach((item) => {
      const categories = item.dataset.categories.split(","); // convert back to array
      const match = selectedValue === "all" || categories.includes(selectedValue);
      item.classList.toggle("active", match);
    });
  };

  // Dropdown toggle
  DOM.select.addEventListener("click", () => {
    utils.toggleElement(DOM.select);
    DOM.select.setAttribute("aria-expanded", DOM.select.classList.contains("open"));
  });

  // Dropdown items
  DOM.selectItems.forEach((item) => {
    item.addEventListener("click", function () {
      const selectedValue = this.dataset.value;
      DOM.selectValue.innerText = this.innerText;
      utils.toggleElement(DOM.select);
      filterFunc(selectedValue);
    });
  });

  // Buttons
  let lastClickedBtn = DOM.filterBtns[0];
  DOM.filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const selectedValue = this.dataset.value;
      console.log("selectedValue:", selectedValue);
      console.log("this.innerText:", this.innerText);

      DOM.selectValue.innerText = this.innerText;
      filterFunc(selectedValue);

      lastClickedBtn.classList.remove("active");
      this.classList.add("active");
      lastClickedBtn = this;
    });
  });
};
//////////////////////////////////////


/////////// Form Handler ///////////
const formHandler = () => {
  const responseMsg = document.createElement("div");
  responseMsg.id = "form-response";
  DOM.form?.appendChild(responseMsg);
};
////////////////////////////////////


/////////// Navigation Handler ///////////
const navigationHandler = () => {
  DOM.navigationLinks.forEach((link) => {
    link.addEventListener("click", function () {
      const targetPage = this.innerHTML.toLowerCase();

      DOM.pages.forEach((page) => {
        const isActive = targetPage === page.dataset.page;
        page.classList.toggle("active", isActive);
      });

      DOM.navigationLinks.forEach((navLink) => {
        navLink.classList.toggle("active", navLink === this);
      });
    });
  });
};
//////////////////////////////////////////


/////////// Testimonials & Modal Handler ///////////
document.addEventListener("DOMContentLoaded", () => {
  const aboutPage = document.querySelector('article.about.active[data-page="about"]');
  if (!aboutPage) return;

  const wrapper = aboutPage.querySelector(".testimonials-wrapper");
  const list = wrapper.querySelector(".testimonials-list");
  const items = list.querySelectorAll(".testimonials-item");

  if (!list || items.length === 0) return;

  const itemsPerView = 2;
  const totalItems = items.length;
  const step = 1; // MODIFICATION 1: Change step to 1
  let currentIndex = 0;

  function slideTestimonials() {
    currentIndex += step;

    // MODIFICATION 2: Change the condition to reset the slider
    if (currentIndex > totalItems - itemsPerView) {
      currentIndex = 0;
    }

    // MODIFICATION 3: Change the offset calculation for one-by-one sliding
    const singleItemWidth = wrapper.offsetWidth / itemsPerView;
    const offset = currentIndex * singleItemWidth;
    
    list.style.transform = `translateX(-${offset}px)`;
  }

  if (totalItems > itemsPerView) {
    setInterval(slideTestimonials, 3000);
  }
});

// Testimonials Modal Handler
const testimonialsHandler = () => {
  const openModal = () => {
    DOM.modalContainer.classList.add("active");
    DOM.overlay.classList.add("active");
  };

  const closeModal = () => {
    DOM.modalContainer.classList.remove("active");
    DOM.overlay.classList.remove("active");
  };

  DOM.testimonialsItems.forEach((item) => {
    item.addEventListener("click", function () {
      const avatar = this.querySelector("[data-testimonials-avatar]");
      const titleElement = this.querySelector("[data-testimonials-title]");
      const fullnameElement = this.querySelector("[data-testimonials-fullname]");
      const positionElement = this.querySelector("[data-testimonials-position]");
      const textElement = this.querySelector("[data-testimonials-text]");

      const titleText = titleElement ? titleElement.innerHTML : "";
      const fullnameText = fullnameElement ? fullnameElement.textContent.trim() : "";
      const positionText = positionElement ? positionElement.innerHTML : "";
      const textContent = textElement ? textElement.innerHTML : "";
      const finalTitle = fullnameText || titleText;

      if (avatar) {
        DOM.modalImg.src = avatar.src;
        DOM.modalImg.alt = avatar.alt;
      }
      DOM.modalTitle.innerHTML = finalTitle;
      DOM.modalPosition.innerHTML = positionText;
      DOM.modalText.innerHTML = textContent;

      openModal();
    });
  });

  DOM.modalCloseBtn.addEventListener("click", closeModal);

  DOM.overlay.addEventListener("click", closeModal);
};
////////////////////////////////////////////////////


/////////// Initialize All handlers ///////////
document.addEventListener("DOMContentLoaded", () => {
  sidebarHandler();
  testimonialsHandler();
  filterHandler();
  formHandler();
  navigationHandler();
});
///////////////////////////////////////////////