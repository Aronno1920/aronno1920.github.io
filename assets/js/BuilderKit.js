////// BuilderKit -> Service Section Generation //////
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
//////////////////////////////////////////////////////


////// BuilderKit -> Blog Post Section Generation //////
document.addEventListener("DOMContentLoaded", () => {
    fetch('./data/posts.json')
    .then(res => res.json())
    .then(data => renderPosts(data))
    .catch(err => console.error('Failed to load posts.json:', err));
});

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(d);
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
  timeEl.textContent = formatDate(post.date_published);

  const dot2 = document.createElement('span');
  dot2.className = 'dot';

  const readTime = document.createElement('span');
  readTime.className = 'read-time';
  readTime.textContent = post.read_time || '';

  meta.append(category, dot1, timeEl, dot2, readTime);

  const h3 = document.createElement('h3');
  h3.className = 'h3 blog-item-title';
  h3.textContent = post.title || '';

  const excerpt = document.createElement('p');
  excerpt.className = 'blog-text';
  excerpt.textContent = post.excerpt || '';

  const tagsWrap = document.createElement('div');
  tagsWrap.className = 'blog-tags';
  (post.tags || []).forEach(tag => {
    const span = document.createElement('span');
    span.className = 'blog-tag';
    span.textContent = tag;
    tagsWrap.appendChild(span);
  });

  content.append(meta, h3, excerpt, tagsWrap);
  a.append(figure, content);
  li.appendChild(a);

  return li;
}

function renderPosts(posts) {
  const root = document.getElementById('blog-list');
  root.innerHTML = '';
  posts.forEach(post => root.appendChild(createBlogPostItem(post)));
}
////////////////////////////////////////////////////////


////// BuilderKit -> Project Section Generation //////
document.addEventListener("DOMContentLoaded", () => {
  fetch("./data/projects.json")
    .then((res) => res.json())
    .then((projects) => {
      renderProjects(projects);
      initFilters();
    })
    .catch((err) => console.error("Failed to load projects:", err));
});

function renderProjects(projects) {
  const container = document.getElementById("projects-list");
  container.innerHTML = "";

  projects.forEach((project) => {
    const li = document.createElement("li");
    li.className = `project-item active`;
    li.setAttribute("data-filter-item", "");
    li.setAttribute("data-category", project.category.toLowerCase());

    li.innerHTML = `
      <a href="${project.link}">
        <figure class="project-banner-box">
          <img src="${project.image}" alt="${project.alt}" loading="lazy"/>
        </figure>
        <div class="project-content">
          <h3 class="h3 project-title">${project.title}</h3>
          <p class="project-category">${project.description}</p>
          <div class="project-tags">
            ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join("")}
          </div>
        </div>
      </a>
    `;

    container.appendChild(li); // ✅ FIXED
  });
}

function initFilters() {
  const filterButtons = document.querySelectorAll("[data-filter-btn]");
  const selectItems = document.querySelectorAll("[data-select-item]");
  const selectValue = document.querySelector("[data-select-value]"); // ✅ FIXED
  const projectItems = document.querySelectorAll("[data-filter-item]");

  const applyFilter = (category) => {
    projectItems.forEach((item) => {
      const itemCategory = item.getAttribute("data-category").toLowerCase();
      if (category === "all" || category === itemCategory) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
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