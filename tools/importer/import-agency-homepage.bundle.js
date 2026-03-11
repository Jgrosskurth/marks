var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-agency-homepage.js
  var import_agency_homepage_exports = {};
  __export(import_agency_homepage_exports, {
    default: () => import_agency_homepage_default
  });

  // tools/importer/parsers/hero-agency.js
  function parse(element, { document }) {
    const intros = element.querySelectorAll(".cover-intros .intro");
    let heading = null;
    let subheading = null;
    let bodyText = null;
    if (intros.length > 0) {
      heading = intros[0].querySelector("h2");
      bodyText = intros[0].querySelector(".type-body, p");
    }
    if (intros.length > 1) {
      subheading = intros[1].querySelector("h2");
    }
    const preloadLink = element.querySelector('link[rel="preload"][as="image"]');
    const posterUrl = preloadLink ? preloadLink.getAttribute("href") : "https://image.mux.com/P6UGAw00NPyaFLcUJYCn02jQF5A00Gn6z8a/thumbnail.jpg";
    const img = document.createElement("img");
    img.src = posterUrl;
    img.alt = "Hero background";
    const cells = [];
    cells.push([img]);
    const contentWrapper = document.createElement("div");
    const h1 = document.createElement("h1");
    h1.textContent = "The Brand Creation Platform";
    contentWrapper.append(h1);
    if (heading) {
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent.trim();
      contentWrapper.append(h2);
    }
    if (bodyText) {
      contentWrapper.append(bodyText);
    }
    cells.push([contentWrapper]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-agency", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-pillars.js
  function parse2(element, { document }) {
    const pillars = element.querySelectorAll(".pillar");
    const cells = [];
    pillars.forEach((pillar) => {
      const index = pillar.querySelector(".hotspot .index");
      const label = pillar.querySelector(".hotspot .label");
      const overlayContent = pillar.querySelector(".overlay .content");
      const heading = overlayContent ? overlayContent.querySelector("h3") : null;
      const description = overlayContent ? overlayContent.querySelector("p") : null;
      const cellWrapper = document.createElement("div");
      if (index || label) {
        const labelEl = document.createElement("p");
        const strong = document.createElement("strong");
        const parts = [];
        if (index) parts.push(index.textContent.trim());
        if (label) parts.push(label.textContent.trim());
        strong.textContent = parts.join(" ");
        labelEl.append(strong);
        cellWrapper.append(labelEl);
      }
      if (heading) {
        cellWrapper.append(heading);
      }
      if (description) {
        cellWrapper.append(description);
      }
      cells.push([cellWrapper]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-pillars", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-about.js
  function parse3(element, { document }) {
    const contentDiv = element.querySelector(".content-container .content");
    const col1 = document.createElement("div");
    if (contentDiv) {
      const heading = contentDiv.querySelector("h2");
      if (heading) {
        col1.append(heading);
      }
      const textDiv = contentDiv.querySelector(".text.type-body, .type-body");
      if (textDiv) {
        const paragraphs = textDiv.querySelectorAll("p");
        paragraphs.forEach((p) => col1.append(p));
      }
    }
    const video = element.querySelector(".media-container video[poster]");
    const col2 = document.createElement("div");
    if (video) {
      const posterUrl = video.getAttribute("poster");
      const img = document.createElement("img");
      img.src = posterUrl;
      img.alt = "About section media";
      col2.append(img);
    }
    const cells = [];
    cells.push([col1, col2]);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-about", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-casestudies.js
  function parse4(element, { document }) {
    const items = element.querySelectorAll(".item");
    const cells = [];
    items.forEach((item) => {
      if (item.classList.contains("showreel")) return;
      const col1 = document.createElement("div");
      const img = document.createElement("img");
      img.src = "https://image.mux.com/P6UGAw00NPyaFLcUJYCn02jQF5A00Gn6z8a/thumbnail.jpg";
      img.alt = "Case study slide";
      col1.append(img);
      const col2 = document.createElement("div");
      const brandLabel = item.querySelector(".headings .type-caption, .headings span:first-child");
      if (brandLabel) {
        const p = document.createElement("p");
        p.textContent = brandLabel.textContent.trim();
        col2.append(p);
      }
      const heading = item.querySelector(".headings h3, .headings .project-heading");
      if (heading) {
        const h3 = document.createElement("h3");
        h3.textContent = heading.textContent.trim();
        col2.append(h3);
      }
      const textDiv = item.querySelector(".type-body.text, .text");
      if (textDiv) {
        const desc = textDiv.querySelector("p");
        if (desc) {
          col2.append(desc);
        }
      }
      cells.push([col1, col2]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-casestudies", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/makemarks-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "svg.logo",
        ".cover-placeholders",
        ".cover-grid",
        ".cover-background",
        ".divider-1",
        ".divider-2",
        ".divider-3",
        ".divider-4",
        ".section-work > .title",
        ".section-work > .media-container"
      ]);
      const navButtons = element.querySelectorAll(".section-work button");
      navButtons.forEach((btn) => btn.remove());
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "link",
        "noscript",
        "source"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        const attrs = Array.from(el.attributes);
        attrs.forEach((attr) => {
          if (attr.name.startsWith("data-") || attr.name === "style") {
            el.removeAttribute(attr.name);
          }
        });
      });
    }
  }

  // tools/importer/transformers/makemarks-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { document } = payload;
      const template = payload.template;
      if (!template || !template.sections || template.sections.length < 2) return;
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(metaBlock);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-agency-homepage.js
  var parsers = {
    "hero-agency": parse,
    "cards-pillars": parse2,
    "columns-about": parse3,
    "carousel-casestudies": parse4
  };
  var PAGE_TEMPLATE = {
    name: "agency-homepage",
    description: "Single-page agency website with animated scrolling sections, portfolio showcase, and contact information",
    urls: [
      "https://makemarks.com/"
    ],
    blocks: [
      {
        name: "hero-agency",
        instances: [".cover"]
      },
      {
        name: "cards-pillars",
        instances: [".cover-pillars"]
      },
      {
        name: "columns-about",
        instances: [".section-about"]
      },
      {
        name: "carousel-casestudies",
        instances: [".section-work .items"]
      }
    ],
    sections: [
      {
        id: "hero-cover",
        name: "Hero / Cover Section",
        selector: ".cover",
        style: "dark",
        blocks: ["hero-agency", "cards-pillars"],
        defaultContent: []
      },
      {
        id: "about",
        name: "About / Platform Description",
        selector: ".section-about",
        style: null,
        blocks: ["columns-about"],
        defaultContent: []
      },
      {
        id: "work",
        name: "Work / Case Studies",
        selector: ".section-work",
        style: null,
        blocks: ["carousel-casestudies"],
        defaultContent: [".section-work .item.showreel"]
      },
      {
        id: "contact",
        name: "Contact / CTA Section",
        selector: ".section-contact",
        style: null,
        blocks: [],
        defaultContent: [".section-contact .content-container", ".section-contact ul"]
      },
      {
        id: "footer",
        name: "Footer",
        selector: "footer",
        style: null,
        blocks: [],
        defaultContent: ["footer"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn(hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_agency_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_agency_homepage_exports);
})();
