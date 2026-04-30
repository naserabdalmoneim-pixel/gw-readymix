(function () {
  "use strict";

  var WHATSAPP_NUMBER = "966530427457";
  var messages = {
    en: {
      defaultSubject: "Website inquiry",
      inquiryTitle: "Hello, I would like to submit a new inquiry from the website.",
      name: "Name",
      email: "Email",
      subject: "Subject",
      message: "Message",
      missing: "Please complete the required fields before sending.",
      invalidEmail: "Please enter a valid email address.",
      opening: "Opening WhatsApp with your message.",
      modalTitle: "Thank you. Your inquiry was sent successfully.",
      modalBody: "We have received your details and will contact you shortly through WhatsApp to provide the right support.",
      modalClose: "Close"
    },
    zh: {
      defaultSubject: "网站咨询",
      inquiryTitle: "您好，我想通过网站提交新的咨询。",
      name: "姓名",
      email: "电子邮箱",
      subject: "主题",
      message: "留言",
      missing: "发送前请填写必填字段。",
      invalidEmail: "请输入有效的电子邮箱地址。",
      opening: "正在通过 WhatsApp 打开您的留言。",
      modalTitle: "谢谢。您的咨询已成功发送。",
      modalBody: "我们已收到您的信息，并会尽快通过 WhatsApp 与您联系，为您提供合适的支持。",
      modalClose: "关闭"
    }
  };

  function currentMessages() {
    return document.documentElement.lang === "zh-CN" ? messages.zh : messages.en;
  }

  function getField(form, name) {
    return form.querySelector('[name="' + name + '"]');
  }

  function valueOf(form, name) {
    var field = getField(form, name);
    return field ? field.value.trim() : "";
  }

  function setStatus(form, message, type) {
    var status = form.querySelector(".wpcf7-response-output");
    if (!status) {
      return;
    }

    status.textContent = message;
    status.classList.remove("is-error", "is-success");
    status.classList.add(type === "error" ? "is-error" : "is-success");
    status.removeAttribute("aria-hidden");
  }

  function ensureModal() {
    var modal = document.querySelector(".uq-whatsapp-modal");
    if (modal) {
      return modal;
    }

    modal = document.createElement("div");
    modal.className = "uq-whatsapp-modal";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = [
      '<div class="uq-whatsapp-modal__backdrop" data-whatsapp-modal-close></div>',
      '<div class="uq-whatsapp-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="uq-whatsapp-modal-title">',
      '<button type="button" class="uq-whatsapp-modal__close" data-whatsapp-modal-close aria-label="Close">&times;</button>',
      '<div class="uq-whatsapp-modal__icon">✓</div>',
      '<h2 id="uq-whatsapp-modal-title"></h2>',
      '<p></p>',
      '<button type="button" class="uq-whatsapp-modal__button" data-whatsapp-modal-close></button>',
      '</div>'
    ].join("");

    modal.addEventListener("click", function (event) {
      if (event.target.hasAttribute("data-whatsapp-modal-close")) {
        closeModal();
      }
    });

    document.body.appendChild(modal);
    return modal;
  }

  function closeModal() {
    var modal = document.querySelector(".uq-whatsapp-modal");
    if (!modal) {
      return;
    }

    modal.classList.remove("is-visible");
    modal.setAttribute("aria-hidden", "true");
  }

  function openSuccessModal() {
    var labels = currentMessages();
    var modal = ensureModal();

    modal.querySelector("h2").textContent = labels.modalTitle;
    modal.querySelector("p").textContent = labels.modalBody;
    modal.querySelector(".uq-whatsapp-modal__button").textContent = labels.modalClose;
    modal.querySelector(".uq-whatsapp-modal__close").setAttribute("aria-label", labels.modalClose);
    modal.classList.add("is-visible");
    modal.setAttribute("aria-hidden", "false");
  }

  function buildMessage(form) {
    var name = valueOf(form, "your-name");
    var email = valueOf(form, "your-email");
    var labels = currentMessages();
    var subject = valueOf(form, "your-subject") || labels.defaultSubject;
    var message = valueOf(form, "your-message");

    return [
      labels.inquiryTitle,
      "",
      labels.name + ": " + name,
      labels.email + ": " + email,
      labels.subject + ": " + subject,
      "",
      labels.message + ":",
      message
    ].join("\n");
  }

  function validate(form) {
    var requiredFields = ["your-name", "your-email", "your-message"];

    for (var i = 0; i < requiredFields.length; i += 1) {
      var field = getField(form, requiredFields[i]);
      if (field && !field.value.trim()) {
        field.focus();
        setStatus(form, currentMessages().missing, "error");
        return false;
      }
    }

    var email = getField(form, "your-email");
    if (email && email.validity && !email.validity.valid) {
      email.focus();
      setStatus(form, currentMessages().invalidEmail, "error");
      return false;
    }

    return true;
  }

  function handleSubmit(event) {
    var form = event.target;
    if (!form.matches(".wpcf7-form")) {
      return;
    }

    event.preventDefault();

    if (!validate(form)) {
      return;
    }

    var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(buildMessage(form));
    setStatus(form, currentMessages().opening, "success");
    window.open(url, "_blank", "noopener");
    openSuccessModal();
  }

  document.addEventListener("submit", handleSubmit);
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeModal();
    }
  });
})();
