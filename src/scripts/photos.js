const ORIGIN = "https://photos.darrenskidmore.com";
const MANIFEST_URL = `${ORIGIN}/manifest.json`;
const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function initPhotosPage() {
  const galleryElement = document.getElementById("photos-gallery");
  const statusElement = document.getElementById("photos-gallery-status");
  const lightboxElement = document.getElementById("photos-lightbox");
  const lightboxImageElement = document.getElementById("photos-lightbox-image");
  const lightboxShellElement = lightboxElement?.querySelector(
    ".photos-lightbox-shell",
  );
  const lightboxCaptionElement = document.getElementById(
    "photos-lightbox-caption",
  );
  const lightboxCounterElement = document.getElementById(
    "photos-lightbox-counter",
  );
  const lightboxCloseElement = document.getElementById("photos-lightbox-close");

  if (
    !(galleryElement instanceof HTMLElement) ||
    !(statusElement instanceof HTMLElement) ||
    !(lightboxElement instanceof HTMLDialogElement) ||
    !(lightboxImageElement instanceof HTMLImageElement) ||
    !(lightboxShellElement instanceof HTMLElement) ||
    !(lightboxCaptionElement instanceof HTMLElement) ||
    !(lightboxCounterElement instanceof HTMLElement) ||
    !(lightboxCloseElement instanceof HTMLButtonElement)
  ) {
    return;
  }

  const lightboxControlElements = Array.from(
    document.querySelectorAll(".photos-lightbox-nav-button[data-direction]"),
  ).filter((element) => element instanceof HTMLButtonElement);

  let photos = [];
  let currentPhotoIndex = 0;
  let lastActiveCard = null;
  let isClosing = false;
  let closeTransitionHandler = null;

  function sortNewestFirst(photoList) {
    return [...photoList].sort((left, right) =>
      String(right.key).localeCompare(String(left.key)),
    );
  }

  function scaledThumbDimensions(photo) {
    const originalWidth = Number(photo.width);
    const originalHeight = Number(photo.height);
    const width = Math.max(1, Math.round(originalWidth / 8));
    const height = Math.max(
      1,
      Math.round((originalHeight * width) / originalWidth),
    );

    return { width, height };
  }

  function imagePath(photo) {
    return encodeURIComponent(String(photo.key));
  }

  function thumbUrl(photo) {
    const { width } = scaledThumbDimensions(photo);
    return `${ORIGIN}/cdn-cgi/image/width=${width},quality=90,format=auto,metadata=none/${imagePath(photo)}`;
  }

  function fullUrl(photo) {
    return `${ORIGIN}/cdn-cgi/image/quality=90,format=auto,metadata=none/${imagePath(photo)}`;
  }

  function cameraLabel(photo) {
    return [photo.make, photo.model].filter(Boolean).join(" ");
  }

  function formattedFNumber(photo) {
    if (photo.fNumber == null) {
      return "";
    }

    return `\u{1D453}/${Number(photo.fNumber).toString()}`;
  }

  function descriptionText(photo) {
    return typeof photo.description === "string"
      ? photo.description.trim()
      : "";
  }

  function formattedDate(photo) {
    const candidate =
      typeof photo.contentCreated === "string" && photo.contentCreated
        ? photo.contentCreated
        : String(photo.key ?? "");
    const match = candidate.match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (!match) {
      return "";
    }

    const [, year, month, day] = match;
    const date = new Date(`${year}-${month}-${day}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return DATE_FORMATTER.format(date);
  }

  function copyrightNoticeText(photo) {
    console.log(photo);
    return typeof photo.copyrightNotice === "string"
      ? photo.copyrightNotice.trim()
      : "";
  }

  function cardDescriptionText(photo) {
    const date = formattedDate(photo);
    const description = descriptionText(photo);

    if (date && description) {
      return `${date}: ${description}`;
    }

    return date || description;
  }

  function gpsText(photo) {
    if (
      !photo.gps ||
      typeof photo.gps.lat !== "number" ||
      typeof photo.gps.lon !== "number"
    ) {
      return "";
    }

    return `(${photo.gps.lat.toFixed(6)}, ${photo.gps.lon.toFixed(6)})`;
  }

  function altText(photo, index) {
    const description = descriptionText(photo);

    if (description) {
      return description;
    }

    return `Photo ${index + 1} of ${photos.length}`;
  }

  function captionText(photo) {
    return descriptionText(photo);
  }

  function createMetadataRow(className, leftText, rightText) {
    const row = document.createElement("div");
    row.className = `photos-meta-row ${className}`.trim();

    if (leftText) {
      const left = document.createElement("span");
      left.textContent = leftText;
      row.append(left);
    }

    if (rightText) {
      const right = document.createElement("span");
      right.textContent = rightText;
      row.append(right);
    }

    return row;
  }

  function createPhotoCard(photo, index) {
    const button = document.createElement("button");
    const thumb = document.createElement("div");
    const image = document.createElement("img");
    const metadata = document.createElement("div");
    const copyright = copyrightNoticeText(photo);
    const summary = cardDescriptionText(photo);
    const gps = gpsText(photo);
    const label = cameraLabel(photo);
    const fNumber = formattedFNumber(photo);
    const { width, height } = scaledThumbDimensions(photo);

    button.type = "button";
    button.className = "card photos-card";
    button.dataset.index = String(index);
    button.setAttribute(
      "aria-label",
      `Open photo ${index + 1} of ${photos.length}`,
    );

    thumb.className = "photos-thumb";

    image.src = thumbUrl(photo);
    image.alt = altText(photo, index);
    image.width = width;
    image.height = height;
    image.loading = "lazy";
    image.decoding = "async";

    metadata.className = "photos-meta";

    if (copyright) {
      const descriptionRow = document.createElement("p");
      descriptionRow.className = "photos-license";
      descriptionRow.textContent = copyright;
      metadata.append(descriptionRow);
    }

    if (summary) {
      const descriptionRow = document.createElement("p");
      descriptionRow.className = "photos-meta-description";
      descriptionRow.textContent = summary;
      metadata.append(descriptionRow);
    }

    metadata.append(createMetadataRow("photos-meta-primary", label, fNumber));

    if (gps) {
      const gpsRow = document.createElement("p");
      gpsRow.className = "photos-meta-gps";
      gpsRow.textContent = gps;
      metadata.append(gpsRow);
    }

    thumb.append(image);
    button.append(thumb, metadata);

    return button;
  }

  function renderLightbox() {
    const photo = photos[currentPhotoIndex];

    if (!photo) {
      return;
    }

    lightboxImageElement.src = fullUrl(photo);
    lightboxImageElement.alt = altText(photo, currentPhotoIndex);
    lightboxImageElement.width = Number(photo.width);
    lightboxImageElement.height = Number(photo.height);
    lightboxCaptionElement.textContent = captionText(photo);
    lightboxCaptionElement.hidden = lightboxCaptionElement.textContent === "";
    lightboxCounterElement.textContent = `${currentPhotoIndex + 1} / ${photos.length}`;
  }

  function moveLightbox(step) {
    if (!photos.length) {
      return;
    }

    currentPhotoIndex =
      (currentPhotoIndex + step + photos.length) % photos.length;
    renderLightbox();
  }

  function openLightbox(index, trigger) {
    if (!photos.length) {
      return;
    }

    if (closeTransitionHandler) {
      lightboxShellElement.removeEventListener(
        "transitionend",
        closeTransitionHandler,
      );
      closeTransitionHandler = null;
    }

    isClosing = false;
    currentPhotoIndex = index;
    lastActiveCard = trigger instanceof HTMLElement ? trigger : null;
    renderLightbox();

    if (!lightboxElement.open) {
      lightboxElement.showModal();
    }

    requestAnimationFrame(() => {
      lightboxElement.dataset.state = "open";
    });
  }

  function closeLightbox() {
    if (!lightboxElement.open || isClosing) {
      return;
    }

    const transitionDuration = Number.parseFloat(
      window.getComputedStyle(lightboxShellElement).transitionDuration || "0",
    );

    isClosing = true;
    delete lightboxElement.dataset.state;

    if (transitionDuration === 0) {
      isClosing = false;
      lightboxElement.close();
      return;
    }

    closeTransitionHandler = (event) => {
      if (
        event.target !== lightboxShellElement ||
        event.propertyName !== "opacity"
      ) {
        return;
      }

      lightboxShellElement.removeEventListener(
        "transitionend",
        closeTransitionHandler,
      );
      closeTransitionHandler = null;
      isClosing = false;
      lightboxElement.close();
    };

    lightboxShellElement.addEventListener(
      "transitionend",
      closeTransitionHandler,
    );
  }

  function renderGallery(photoList) {
    const fragment = document.createDocumentFragment();

    photoList.forEach((photo, index) => {
      fragment.append(createPhotoCard(photo, index));
    });

    galleryElement.replaceChildren(fragment);
    galleryElement.hidden = false;
    statusElement.hidden = true;
  }

  async function loadPhotos() {
    try {
      const response = await fetch(MANIFEST_URL);

      if (!response.ok) {
        throw new Error(`Failed to fetch manifest: ${response.status}`);
      }

      const data = await response.json();
      const manifestPhotos = Array.isArray(data.photos) ? data.photos : [];
      photos = sortNewestFirst(manifestPhotos);

      if (!photos.length) {
        statusElement.textContent = "No photos found in the manifest.";
        return;
      }

      renderGallery(photos);
    } catch (error) {
      statusElement.textContent = "Unable to load photos.";
      console.error(error);
    }
  }

  galleryElement.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const card = target.closest(".photos-card");

    if (!(card instanceof HTMLButtonElement)) {
      return;
    }

    openLightbox(Number(card.dataset.index), card);
  });

  lightboxControlElements.forEach((control) => {
    control.addEventListener("click", () => {
      const direction = control.dataset.direction === "prev" ? -1 : 1;
      moveLightbox(direction);
    });
  });

  lightboxElement.addEventListener("click", (event) => {
    if (event.target === lightboxElement) {
      closeLightbox();
    }
  });

  lightboxCloseElement.addEventListener("click", () => {
    closeLightbox();
  });

  lightboxElement.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeLightbox();
  });

  lightboxElement.addEventListener("close", () => {
    if (closeTransitionHandler) {
      lightboxShellElement.removeEventListener(
        "transitionend",
        closeTransitionHandler,
      );
      closeTransitionHandler = null;
    }

    isClosing = false;
    delete lightboxElement.dataset.state;
    lightboxImageElement.removeAttribute("src");

    if (lastActiveCard) {
      lastActiveCard.focus();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!lightboxElement.open) {
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveLightbox(-1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveLightbox(1);
    }
  });

  loadPhotos();
}

initPhotosPage();
