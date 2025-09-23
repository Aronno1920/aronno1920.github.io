////// BuilderKit -> Service Section Generation //////
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("./data/services.json");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const services = await response.json();
    renderServices(services);
  } catch (error) {
    console.error("Failed to load services:", error);
  }
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
//////////////////////////////////////////////////////


////// BuilderKit -> Blog Post Section Generation //////
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("./data/posts.json");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const posts = await response.json();
    renderPosts(posts);
  } catch (error) {
    console.error("Failed to load services:", error);
  }
});

function renderPosts(posts) {
  const root = document.getElementById('blog-list');
  root.innerHTML = '';
  posts.forEach(post => root.appendChild(createBlogPostItem(post)));
}

function createBlogPostItem(post) {
  const li = document.createElement('li');
  li.className = 'blog-post-item';

  const a = document.createElement('a');
  a.className = 'blog-post-link';
  a.href = post.url || '#';
  a.setAttribute('data-blog-id', post.id || '');
  a.target = '_blank'

  const figure = document.createElement('figure');
  figure.className = 'blog-banner-box';
  const img = document.createElement('img');
  img.src = post.image?.src || '';
  img.alt = post.image?.alt || '';
  if (post.image?.loading) img.loading = post.image.loading;
  figure.appendChild(img);

  const content = document.createElement('div');
  content.className = 'blog-content';

  const meta = document.createElement('div');
  meta.className = 'blog-meta';

  const category = document.createElement('p');
  category.className = 'blog-category';
  category.textContent = post.category || '';

  const dot1 = document.createElement('span');
  dot1.className = 'dot';

  const timeEl = document.createElement('time');
  timeEl.dateTime = post.date_published || '';
  timeEl.textContent = post.date_published;

  const dot2 = document.createElement('span');
  dot2.className = 'dot';

  const readTime = document.createElement('span');
  readTime.className = 'read-time';
  readTime.textContent = post.read_time || '';

  meta.append(category, dot1, timeEl, dot2, readTime);

  const h3 = document.createElement('h3');
  h3.className = 'h3 blog-item-title';
  h3.textContent = post.title || '';

  content.append(meta, h3);
  a.append(figure, content);
  li.appendChild(a);

  return li;
}
////////////////////////////////////////////////////////


////// BuilderKit -> Project Section Generation //////
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("./data/projects.json");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const projects = await response.json();
    renderProjects(projects);
    initFilters();
  } catch (error) {
    console.error("Failed to load services:", error);
  }
});

function renderProjects(projects) {
  const container = document.getElementById("projects-list");
  container.innerHTML = "";

  projects.forEach((project) => {
    const li = document.createElement("li");
    li.className = `project-item active`;
    li.setAttribute("data-filter-item", "");
    // Join the array into a single string for the data attribute
    li.setAttribute("data-categories", project.categories.join(","));

    const tagsHTML = project.tags
        .map(tag => `<span>${tag}</span>`)
        .join('<span class="dot"></span>');

    li.innerHTML = `
      <a href="${project.link}" target="_blank">
        <figure class="project-banner-box">
          <img src="${project.image}" alt="${project.alt}" loading="lazy"/>
        </figure>
        <div class="project-content">
          <h3 class="h3 project-title">${project.title}</h3>
          <div class="project-meta">
            ${tagsHTML}
          </div>
          <p class="project-description">${project.description}</p>
        </div>
      </a>
    `;

    container.appendChild(li);
  });
}

function initFilters() {
  const filterButtons = document.querySelectorAll("[data-filter-btn]");
  const selectItems = document.querySelectorAll("[data-select-item]");
  const selectValue = document.querySelector("[data-select-value]");
  const projectItems = document.querySelectorAll("[data-filter-item]");

  const applyFilter = (category) => {
    projectItems.forEach((item) => {
      // Get the categories string from the data attribute and split it back into an array
      const itemCategories = item.getAttribute("data-categories").split(',');
      const shouldShow = category === "all" || itemCategories.includes(category);
      item.style.display = shouldShow ? "block" : "none";
    });
  };

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.textContent.trim().toLowerCase();
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      applyFilter(category);
    });
  });

  selectItems.forEach((item) => {
    item.addEventListener("click", () => {
      const category = item.textContent.trim().toLowerCase();
      selectValue.textContent = item.textContent;
      applyFilter(category);
    });
  });
}
//////////////////////////////////////////////////////


////// BuilderKit -> Certifications Section Generation //////
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("./data/educations.json");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    renderTimelineItems(data.educations, "education-list");
    renderTimelineItems(data.certifications, "certifications-list");
    renderTimelineItems(data.workshops, "workshop-list");

  } catch (error) {
    console.error("Failed to load data:", error);
  }
});

function renderTimelineItems(items, containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with ID "${containerId}" not found.`);
    return;
  }
  
  container.innerHTML = "";

  items.forEach((item) => {
    const li = document.createElement("li");
    li.className = "timeline-item";

    const credentialHtml = item.credentialUrl
      ? `
        <div class="timeline-credential">
          <span class="timeline-item-date">${item.date}</span>
          <a href="${item.credentialUrl}" target="_blank" class="timeline-credential-url">Show credential</a>
        </div>
        `
      : `<span class="timeline-item-date">${item.date}</span>`;

    li.innerHTML = `
      <h4 class="h4 timeline-item-title">${item.title}</h4>
      <span class="timeline-item-organization">${item.organization}</span>
      ${credentialHtml}
      <p class="timeline-text">${item.skill}</p>
    `;
    
    container.appendChild(li);
  });
}
/////////////////////////////////////////////////////////////


////// BuilderKit -> Experiences Section Generation //////
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("./data/experiences.json");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    renderExperiences(data);
  } catch (error) {
    console.error("Failed to load data:", error);
  }
});

function renderExperiences(items) {
  const container = document.getElementById("experience-list");
  if (!container) {
    console.error(`Container with ID "${"experience-list"}" not found.`);
    return;
  }
  
  container.innerHTML = "";

  items.forEach((item) => {
    const li = document.createElement("li");
    li.className = "timeline-item";

    const jobsHtml = `
      <ul>
        ${item.jobs.map(job => `<li class="timeline-text">${job}</li>`).join('')}
      </ul>
    `;

    li.innerHTML = `
      <h4 class="h4 timeline-item-title">${item.designation}</h4>
      <span class="timeline-item-organization">${item.organization}</span>
      <span class="timeline-item-date">${item.date}</span>
      ${jobsHtml}
    `;
    
    container.appendChild(li);
  });
}
/////////////////////////////////////////////////////////////


////// BuilderKit -> Testimonials Section Generation //////
document.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch("./data/testimonials.json");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

  const testimonials = await response.json();;
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
/////////////////////////////////////////////////////////////