(function () {
  "use strict";

  var STORAGE_KEY = "uq-site-language";
  var DEFAULT_LANGUAGE = "en";
  var currentLanguage = DEFAULT_LANGUAGE;
  var isTranslating = false;
  var pendingTranslation = null;
  var translationObserver = null;
  var observerOptions = {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true
  };
  var languageLabels = {
    en: "Languages",
    zh: "语言",
    ar: "اللغات"
  };
  var languageSelectorLabels = {
    en: "Language selector",
    zh: "语言选择器",
    ar: "محدد اللغة"
  };
  var languageDirections = {
    en: "ltr",
    zh: "ltr",
    ar: "rtl"
  };
  var languageOptionLabels = {
    en: {
      en: "English",
      zh: "Chinese",
      ar: "Arabic"
    },
    zh: {
      en: "英语",
      zh: "中文",
      ar: "阿拉伯语"
    },
    ar: {
      en: "الإنجليزية",
      zh: "الصينية",
      ar: "العربية"
    }
  };
  var contactFormLabels = {
    en: {
      namePlaceholder: "Full name",
      emailPlaceholder: "name@example.com",
      subjectPlaceholder: "How can we help?",
      messagePlaceholder: "Write your message here...",
      submit: "Send"
    },
    zh: {
      namePlaceholder: "姓名全称",
      emailPlaceholder: "电子邮箱",
      subjectPlaceholder: "我们可以如何帮助您？",
      messagePlaceholder: "请在此输入您的留言...",
      submit: "发送"
    },
    ar: {
      namePlaceholder: "الاسم الكامل",
      emailPlaceholder: "البريد الإلكتروني",
      subjectPlaceholder: "كيف يمكننا مساعدتك؟",
      messagePlaceholder: "اكتب رسالتك هنا...",
      submit: "إرسال"
    }
  };
  var reverseDictionaries = {};

  var dictionary = {
    "Muhajir AlMuttahida Company For Contracting": "穆哈吉尔联合承包公司",
    "Skip to content": "跳至内容",
    "Main Menu": "主菜单",
    "Breadcrumbs": "面包屑导航",
    "Slider": "轮播",
    "Contact form": "联系表单",
    "Home": "首页",
    "Our Company": "关于公司",
    "Introduction": "公司简介",
    "GM Message": "总经理致辞",
    "Our Vision & Mission": "愿景与使命",
    "Divisions & Factories": "部门与工厂",
    "Asphalt Plant": "沥青厂",
    "Road Painting & Safety Division": "道路标线与交通安全部",
    "Crusher Plant": "破碎厂",
    "Contracting Division": "承包工程部",
    "Road Contracting Division": "道路承包部",
    "Profile": "公司资料",
    "Contact us": "联系我们",
    "Contact Us": "联系我们",
    "Phone Us": "电话咨询",
    "Phone Us +966530427457": "电话咨询 +966530427457",
    "Email Us": "电子邮件",
    "Email Us Info@unitedquarries.com.sa": "电子邮件 Info@unitedquarries.com.sa",
    "Our Location": "我们的位置",
    "Our Location KSA , JEDDAH": "我们的位置 沙特阿拉伯，吉达",
    "KSA , JEDDAH": "沙特阿拉伯，吉达",
    "KSA – Madinah": "沙特阿拉伯 - 麦地那",
    "Yanbu Alsinaiyah – C6": "延布工业城 - C6",
    "Search in Website": "站内搜索",
    "Search for:": "搜索：",
    "Email": "电子邮箱",
    "Email Info@unitedquarries.com.sa": "电子邮箱 Info@unitedquarries.com.sa",
    "Phone": "电话",
    "Phone +966530427457": "电话 +966530427457",
    "Location": "位置",
    "Location:": "位置：",
    "Location KSA , JEDDAH": "位置 沙特阿拉伯，吉达",
    "© 2026 Muhajir AlMuttahida Company For Contracting. All rights reserved.": "© 2026 穆哈吉尔联合承包公司。保留所有权利。",
    "Search": "搜索",
    "Search…": "搜索…",
    "Read more": "阅读更多",
    "Read less": "收起",
    "Back to Home": "返回首页",
    "Page Not Found": "页面未找到",
    "The page you requested is not available.": "您请求的页面暂不可用。",
    "Something to say? Get In Touch!": "有任何需求？欢迎联系我们！",
    "We'll get right back to you": "我们会尽快回复您",
    "Let’s Discuss Your Project": "让我们讨论您的项目",
    "Share your inquiry and our team will respond with the right support.": "请提交您的咨询，我们的团队将为您提供合适的支持。",
    "Tell us about your requirements, and our team will connect with you promptly to support your next project.": "请告诉我们您的需求，我们的团队将及时与您联系，支持您的下一个项目。",
    "Complete the form and we will open WhatsApp with your inquiry ready to send.": "填写表格后，我们会打开 WhatsApp，并为您准备好要发送的咨询内容。",
    "Your Name (required)": "您的姓名（必填）",
    "Full name": "姓名全称",
    "Your Email (required)": "您的邮箱（必填）",
    "name@example.com": "name@example.com",
    "Subject": "主题",
    "How can we help?": "我们可以如何帮助您？",
    "Your Message": "您的留言",
    "Write your message here...": "请在此输入您的留言...",
    "Send": "发送",
    "Find Us Here": "在这里找到我们",
    "Contact Infromation": "联系信息",
    "Contact Information": "联系信息",
    "Contact Us:": "联系方式：",
    "Location: KSA , JEDDAH": "位置：沙特阿拉伯，吉达",
    "Address:": "地址：",
    "P.O. Box: 30094": "邮政信箱：30094",
    "Postal Code: 41912": "邮政编码：41912",
    "Weekday’s:": "工作日：",
    "Sunday – Thursday:": "周日至周四：",
    "08:00 AM to 05:30 PM": "上午 08:00 至下午 05:30",
    "Friday:": "周五：",
    "Saturday:": "周六：",
    "Closed": "休息",
    "Emails:": "电子邮箱：",
    "Call Us:": "联系电话：",
    "Message from The General Manager": "总经理致辞",
    "Dear Customers and Employees,": "尊敬的客户和员工：",
    "Thank you for visiting our website to learn more about our company.": "感谢您访问我们的网站，进一步了解我们的公司。",
    "Sincerely,": "此致敬礼，",
    "Building Reliable Value for Every Client": "为每一位客户创造可靠价值",
    "Our Vision": "我们的愿景",
    "Our Mission": "我们的使命",
    "Our Aim": "我们的目标",
    "Provide customer-driven total solutions.": "提供以客户需求为导向的整体解决方案。",
    "Continuously improve our services, equipment, and workforce capabilities.": "持续提升我们的服务、设备和团队能力。",
    "Deliver reliable, timely, and responsive service.": "提供可靠、及时且响应迅速的服务。",
    "Create long-term value through high-quality work and responsible growth.": "通过高质量工作和负责任的发展创造长期价值。",
    "Company Profile of Muhajir AlMuttahida Company For Contracting": "穆哈吉尔联合承包公司资料",
    "View Profile": "查看资料",
    "Download Profile": "下载资料",
    "File format: PDF": "文件格式：PDF",
    "Contracting Slider -Home": "承包工程首页轮播",
    "Project Slider -Home": "项目首页轮播",
    "Operations Slider -Home": "运营首页轮播",
    "previous arrow": "上一张",
    "next arrow": "下一张",
    "Asphalt and milling plant operations": "沥青与铣刨厂运营",
    "Additional asphalt plant operations view": "更多沥青厂运营视图",
    "► Asphalt Plant": "► 沥青厂",
    "► Contracting Division": "► 承包工程部",
    "► Road Contracting Division": "► 道路承包部",
    "► Road Painting & Safety Division": "► 道路标线与交通安全部",
    "► Crusher Plant": "► 破碎厂",
    "► Introduction": "► 公司简介",
    "► GM Message": "► 总经理致辞",
    "► Our Vision & Mission": "► 愿景与使命",
    "Access the official company profile to review our background, capabilities, operational strengths, and project experience in one organized document.": "查看公司官方资料，通过一份结构清晰的文件了解我们的背景、能力、运营优势和项目经验。",
    "Use the options below to open the profile directly in your browser or download a copy for offline review and sharing.": "您可以使用以下选项在浏览器中直接打开公司资料，或下载副本以便离线查看和分享。",
    "Our direction is shaped by quality, dependable delivery, and practical solutions that support construction, asphalt materials, and logistics needs across the Kingdom of Saudi Arabia.": "我们的发展方向以质量、可靠交付和务实解决方案为基础，服务沙特阿拉伯全国范围内的施工、沥青材料和物流需求。",
    "To be the company that best understands customer needs and delivers products and services that consistently earn long-term trust.": "成为最了解客户需求，并持续提供值得长期信赖的产品与服务的公司。",
    "To be recognized as a leading company in Saudi Arabia for asphalt materials, contracting support, and logistics services.": "成为沙特阿拉伯在沥青材料、承包支持和物流服务领域公认的领先企业。",
    "Is one of the most significant groups in Kingdom of Saudi Arabia, Established in 2013, since its creation, Muhajir AlMuttahida Company For Contracting has been trying to constantly increase and diversify its activities in related field of construction contracting. Since that time both the size and significance of the group have been notably increasing by further investments in New Establishments (Divisions). Presently, the all Muhajir AlMuttahida Company For Contracting divisions count more than 850 employees. The group has a clear strategy of using its collective skills and understanding of markets to develop a unique value proposition to clients.": "穆哈吉尔联合承包公司是沙特阿拉伯重要的企业集团之一。公司成立于 2013 年，自成立以来一直致力于在建筑承包相关领域持续扩大并多元化业务。通过不断投资新的机构和部门，集团规模与影响力显著提升。目前，公司各部门员工总数超过 850 人。集团拥有清晰战略，善用综合能力和市场洞察，为客户打造独特的价值主张。",
    "Muhajir AlMuttahida Company For Contracting was established in 2013 having grown and expanded over the last years. The head office is located in KSA , JEDDAH.": "穆哈吉尔联合承包公司成立于 2013 年，并在过去几年持续成长和扩展。公司总部位于沙特阿拉伯吉达。",
    "When the company was established, the development in the Kingdom was still in its infancy and only a few entrepreneurs were willing to take the risk, or had the ability to form a construction company. However, Muhajir AlMuttahida Company For Contracting succeeded in creating a Saudi Arabian Owned firm capable of performing many diverse projects.": "公司成立之初，沙特阿拉伯的发展仍处于早期阶段，愿意承担风险或具备能力创办建筑公司的企业家并不多。然而，穆哈吉尔联合承包公司成功打造了一家沙特本土企业，能够承接多类型项目。",
    "Although the company activities in those early years were concentrated on projects related to earth moving and road works only, the VISION of the founder did not end there. Muhajir AlMuttahida Company For Contracting mission is to participate and contribute its expertise in the growing development of the Kingdom. Thus, for its 13 years of existence, Muhajir AlMuttahida Company For Contracting has developed and maintained a large staff of proven technical and management personnel, experienced specialists in the design, planning and construction department, together with sound technical and commercial management teams that ensure efficient and timely execution of any project that it may undertake.": "尽管公司早期业务主要集中在土方和道路工程项目，但创始人的愿景并未止步于此。穆哈吉尔联合承包公司的使命，是参与并贡献专业经验，助力沙特阿拉伯不断发展。因此，在 13 年的发展历程中，公司建立并保持了一支庞大的专业团队，包括成熟的技术与管理人员、设计、规划和施工领域的资深专家，以及稳健的技术和商务管理团队，确保所承接项目能够高效、及时地执行。",
    "Although the company activities in those early years were concentrated on projects related to earthmoving and road works only, the VISION of the founder did not end there. Muhajir AlMuttahida Company For Contracting mission is to participate and contribute its expertise in the growing development of the Kingdom. Thus, for its 13 years of existence, Muhajir AlMuttahida Company For Contracting has developed and maintained a large staff of proven technical and management personnel, experienced specialists in the design, planning and construction department, together with sound technical and commercial management teams that ensure efficient and timely execution of any project that it may undertake.": "尽管公司早期业务主要集中在土方和道路工程项目，但创始人的愿景并未止步于此。穆哈吉尔联合承包公司的使命，是参与并贡献专业经验，助力沙特阿拉伯不断发展。因此，在 13 年的发展历程中，公司建立并保持了一支庞大的专业团队，包括成熟的技术与管理人员、设计、规划和施工领域的资深专家，以及稳健的技术和商务管理团队，确保所承接项目能够高效、及时地执行。",
    "Muhajir AlMuttahida Company For Contracting is one of the leading companies in Construction of Roads in the whole region since it is constructed and until nowadays it did many successful completed road projects including Asphalt, Earthwork, Infrastructure, Lighting, Culverts, Sign Boards, Pavement Markings, Rip Rap and all the related work.": "穆哈吉尔联合承包公司是整个地区道路建设领域的领先企业之一。自成立以来，公司成功完成了众多道路项目，涵盖沥青、土方、基础设施、照明、涵洞、标志牌、路面标线、护坡石以及相关工程。",
    "At present, the number of our full-time staff and employees exceeds five hundred personnel working at Yanbu. These employees are supported by state-of-the-art Computer Management and Computer Aided Design Systems and utilizing a fleet of plant and equipment.": "目前，我们在延布工作的全职员工超过 500 人。这些员工依托先进的计算机管理和计算机辅助设计系统，并配备成套机械设备开展工作。",
    "Today, Muhajir AlMuttahida Company For Contracting has a successful track record of completing many projects from government and private parties throughout the Kingdom and Muhajir AlMuttahida Company For Contracting is widely known as a very professional firm that can assure clients that they will be utilizing a first-class firm with a professional background, high level of experience and broad capability. Accordingly, our mission continues to be providing excellent professional services to a wider range of customers.": "如今，穆哈吉尔联合承包公司在沙特阿拉伯各地为政府和私营客户完成了大量项目，拥有成功业绩。公司以高度专业而广为人知，能够让客户确信其合作对象是一家拥有专业背景、丰富经验和广泛能力的一流企业。因此，我们的使命仍然是为更广泛的客户群体提供卓越的专业服务。",
    "I hope that you find our website informative and I invite you to come back and visit frequently. We are continually updating our site with new and additional information.": "希望您能从我们的网站获得有价值的信息，也欢迎您经常回来访问。我们会持续更新网站，提供新的和更多的信息。",
    "We welcome your comments and questions so please do not hesitate to contact us for information, assistance, or to make a recommendation of how we can improve. â€œ": "我们欢迎您的意见和问题。如需信息、协助，或希望提出改进建议，请随时联系我们。",
    "We welcome your comments and questions so please do not hesitate to contact us for information, assistance, or to make a recommendation of how we can improve. Ã¢â‚¬Å“": "我们欢迎您的意见和问题。如需信息、协助，或希望提出改进建议，请随时联系我们。",
    "Our success begins and ends with our staff. I am thankful and proud to be part of a team that is fully committed to working diligently and following safety guidelines. Our vision is to build the â€˜client experienceâ€™ through projects which reflect the values of our family. The process at which we execute our projects from start to finish provides our clients with a memorable and positive experience.": "我们的成功始于员工，也归功于员工。我很感谢并自豪能成为这个团队的一员，大家勤勉工作并严格遵守安全规范。我们的愿景是通过体现公司价值观的项目，打造卓越的客户体验。从项目启动到完成的执行过程，都会为客户带来积极而难忘的体验。",
    "Our success begins and ends with our staff. I am thankful and proud to be part of a team that is fully committed to working diligently and following safety guidelines. Our vision is to build the Ã¢â‚¬Ëœclient experienceÃ¢â‚¬â„¢ through projects which reflect the values of our family. The process at which we execute our projects from start to finish provides our clients with a memorable and positive experience.": "我们的成功始于员工，也归功于员工。我很感谢并自豪能成为这个团队的一员，大家勤勉工作并严格遵守安全规范。我们的愿景是通过体现公司价值观的项目，打造卓越的客户体验。从项目启动到完成的执行过程，都会为客户带来积极而难忘的体验。",
    "Since stepping into the role of General Manager a couple of years ago it has been a passion of mine to increase our community involvement as a team. Having a positive effect on our community is important to me and echoes our company values. Within our company, Iâ€™m passionate about building an organization which challenges all of our employees to be the best version of themselves every single day.": "自几年前担任总经理以来，推动团队更多参与社区事务一直是我热衷的方向。为社区带来积极影响对我非常重要，也体现了公司的价值观。在公司内部，我致力于建设一个能够激励所有员工每天不断提升自我的组织。",
    "Since stepping into the role of General Manager a couple of years ago it has been a passion of mine to increase our community involvement as a team. Having a positive effect on our community is important to me and echoes our company values. Within our company, IÃ¢â‚¬â„¢m passionate about building an organization which challenges all of our employees to be the best version of themselves every single day.": "自几年前担任总经理以来，推动团队更多参与社区事务一直是我热衷的方向。为社区带来积极影响对我非常重要，也体现了公司的价值观。在公司内部，我致力于建设一个能够激励所有员工每天不断提升自我的组织。",
    "We are leading producer of aggregates, sand & grave/ materials in kingdom of Saudi Arabia, We have our own 07 Crusher Plants in Kingdom. We have 02 different quarries in which we 06 Crusher Plants are from Tele-Smith USA & 01 is from Symon- China, we manufacture products that specifically cater to the construction, ready mix, and asphalt industries,": "我们是沙特阿拉伯骨料、砂石材料的主要生产商，拥有 7 座自有破碎厂。公司拥有 2 处采石场，其中 6 座破碎厂来自美国 Telsmith，1 座来自中国 Symons。我们的产品专门服务于建筑、预拌混凝土和沥青行业。",
    "We have complete independent setup along with Diesel Generating sets which are keeping Crushers operational all the time, CAT Brand wheel loaders which are feeding the crushers round the clock & Mercedes trailers which are giving logistic support to supply produced material to all of our customers in Kingdom of Saudi Arabia.": "我们拥有完整独立的配套设施，并配备柴油发电机组，确保破碎设备持续运行。CAT 品牌装载机全天候为破碎机供料，梅赛德斯拖车提供物流支持，将生产材料供应给沙特阿拉伯各地客户。",
    "We enjoy an outstanding reputation in the market for high quality asphalt supply, our asphalt operation has achieved significant growth over the past few years and the company is planning to further enhance resources to accommodate the demand for supplies, both in-house as well as external projects.": "我们在高质量沥青供应市场享有卓越声誉。过去几年，我们的沥青业务实现显著增长，公司计划进一步加强资源配置，以满足内部项目和外部项目的供应需求。",
    "we have just imported one more new asphalt plant from Handa China Now we have the 04 Complete asphalt plants, 01 from Parker & 03 from Handa China, we are producing best quality asphalt & cater the needs of our own road construction division & external customers, No doubt we are the expert of Asphalt technology & trusted name in Kingdom of Saudi Arabia.": "我们刚从中国 Handa 新进口了一套沥青设备。目前公司拥有 4 套完整沥青厂，其中 1 套来自 Parker，3 套来自中国 Handa。我们生产高质量沥青，满足自有道路施工部门和外部客户需求。毫无疑问，我们是沥青技术领域的专家，也是沙特阿拉伯值得信赖的品牌。",
    "Our Civil Contraction Division has a reputation for professionalism, orginazation experience and technical knowledge. We build strong relationships with consultants, subcontractors and suppliers, which allow us to offer innovative solutions to project challenges that benefit our clients.": "我们的土建承包部门以专业精神、组织经验和技术知识而闻名。我们与顾问、分包商和供应商建立稳固关系，使我们能够针对项目挑战提供创新解决方案，为客户创造价值。",
    "We have completed & handed over several projects on time in Kingdom of Saudi Arabia. The Company's strength lies in having a formidable team of well qualified and experienced Managers, Engineers and Technicians capable of Designing, Planning and execution of Projects. The other strength lies in the form of precise Machinery, Equipment & Tools required for proper project execution. We are fully equipped with all necessary equipment. We have a dedicated team of Engineers & Skilled labour in our Civil contracting Division.": "我们已在沙特阿拉伯按时完成并移交多个项目。公司的优势在于拥有一支实力雄厚、资质良好且经验丰富的经理、工程师和技术人员团队，能够负责项目设计、规划和执行。另一项优势是配备项目正确执行所需的精密机械、设备和工具。我们拥有全部必要设备，并在土建承包部门配备专职工程师和熟练工人团队。",
    "Has enjoyed a constant growth since it started operation in 2013 as a road contractor. This road to success has been built with ingenuity, Vast Experience & workmanship, the key factors in the growth and stability of the business are our aggressive management team.": "自 2013 年作为道路承包商开展业务以来，公司持续稳步增长。这条成功之路建立在创新、丰富经验和精湛工艺之上，而积极进取的管理团队是业务成长与稳定的关键因素。",
    "This team has grown up in the industry and applies a cost effective and timely approach to the completion of each project. Muhajir AlMuttahida Company For Contracting provides exceptional value to our clients by utilizing professional, trusted and pioneering methods. We remain unfazed by the complexity, scale and vastness of any project put forth to us. We undertake any challenge irrespective of size or complexity from the design stage to the final touch. Muhajir AlMuttahida Company For Contracting Road Construction Division owns and operates big fleet of Top Brands of road construction equipment, Like Bulldozers (CAT & Komatsu) , Motor Graders (CAT), all kind & Size of road rollers ( Hamm, Dynapac, CAT, Bomag Milling machines (Wirtgen) , Paving Machines (VÃ–GELE) & Wheel Loaders (CAT), As we mentioned above that we have our own Asphalt Plants & Crushers which are feeding round the clock to our road Construction division, We have comprehensive solution under one Roof, Our dedicated team of Engineers & skilled workers are always ready to handle any road construction & maintenance job.": "我们的团队深耕行业，并以成本高效、按时交付的方式完成每一个项目。穆哈吉尔联合承包公司凭借专业、可信且具有开创性的方法，为客户提供卓越价值。无论项目的复杂度、规模或范围如何，我们都从容应对。从设计阶段到最终交付，我们承接各种规模和复杂度的挑战。公司的道路施工部门拥有并运营大量顶级品牌道路施工设备，包括 CAT 和 Komatsu 推土机、CAT 平地机、Hamm、Dynapac、CAT 和 Bomag 各类压路机、Wirtgen 铣刨机、Vogele 摊铺机以及 CAT 装载机。正如前文所述，我们拥有自有沥青厂和破碎厂，全天候为道路施工部门供料。我们在同一体系下提供综合解决方案，专职工程师和熟练工人团队随时准备处理各类道路施工和养护工作。",
    "This team has grown up in the industry and applies a cost effective and timely approach to the completion of each project. Muhajir AlMuttahida Company For Contracting provides exceptional value to our clients by utilizing professional, trusted and pioneering methods. We remain unfazed by the complexity, scale and vastness of any project put forth to us. We undertake any challenge irrespective of size or complexity from the design stage to the final touch. Muhajir AlMuttahida Company For Contracting Road Construction Division owns and operates big fleet of Top Brands of road construction equipment, Like Bulldozers (CAT & Komatsu) , Motor Graders (CAT), all kind & Size of road rollers ( Hamm, Dynapac, CAT, Bomag Milling machines (Wirtgen) , Paving Machines (VÃƒâ€“GELE) & Wheel Loaders (CAT), As we mentioned above that we have our own Asphalt Plants & Crushers which are feeding round the clock to our road Construction division, We have comprehensive solution under one Roof, Our dedicated team of Engineers & skilled workers are always ready to handle any road construction & maintenance job.": "我们的团队深耕行业，并以成本高效、按时交付的方式完成每一个项目。穆哈吉尔联合承包公司凭借专业、可信且具有开创性的方法，为客户提供卓越价值。无论项目的复杂度、规模或范围如何，我们都从容应对。从设计阶段到最终交付，我们承接各种规模和复杂度的挑战。公司的道路施工部门拥有并运营大量顶级品牌道路施工设备，包括 CAT 和 Komatsu 推土机、CAT 平地机、Hamm、Dynapac、CAT 和 Bomag 各类压路机、Wirtgen 铣刨机、Vogele 摊铺机以及 CAT 装载机。正如前文所述，我们拥有自有沥青厂和破碎厂，全天候为道路施工部门供料。我们在同一体系下提供综合解决方案，专职工程师和熟练工人团队随时准备处理各类道路施工和养护工作。",
    "As we have the road construction contracting division from 2013 & performance is superb, then the company establish our own division for Road Marking and Traffic Safety Solution. Which has earned a remarkable reputation in trustworthiness, all because of a strong customer-focused approaches": "自 2013 年设立道路施工承包部门以来，其表现一直出色。因此，公司成立了道路标线与交通安全解决方案部门。凭借强烈的客户导向方式，该部门在可靠性方面赢得了卓越声誉。",
    "and the continuous quest for world class quality maintaining, We have 04 Hofmann Road Marking Machines Which Consider state of the art machines in road paint technology, We have complete dedicated well experience team For Road marking Jobs.": "同时，我们持续追求世界级质量。公司拥有 4 台 Hofmann 道路标线设备，这些设备被视为道路涂装技术中的先进机型。我们还拥有一支经验丰富、专门负责道路标线作业的完整团队。"
  };

  var titleDictionary = {
    "Muhajir AlMuttahida Company For Contracting": "穆哈吉尔联合承包公司",
    "Page Not Found | Muhajir AlMuttahida Company For Contracting": "页面未找到 | 穆哈吉尔联合承包公司",
    "Contact Us | Muhajir AlMuttahida Company For Contracting": "联系我们 | 穆哈吉尔联合承包公司",
    "Crusher Plant | Muhajir AlMuttahida Company For Contracting": "破碎厂 | 穆哈吉尔联合承包公司",
    "Divisions & Factories | Muhajir AlMuttahida Company For Contracting": "部门与工厂 | 穆哈吉尔联合承包公司",
    "Asphalt Plant | Muhajir AlMuttahida Company For Contracting": "沥青厂 | 穆哈吉尔联合承包公司",
    "Contracting Division | Muhajir AlMuttahida Company For Contracting": "承包工程部 | 穆哈吉尔联合承包公司",
    "Road Contracting Division | Muhajir AlMuttahida Company For Contracting": "道路承包部 | 穆哈吉尔联合承包公司",
    "Road Painting & Safety Division | Muhajir AlMuttahida Company For Contracting": "道路标线与交通安全部 | 穆哈吉尔联合承包公司",
    "Our Company | Muhajir AlMuttahida Company For Contracting": "关于公司 | 穆哈吉尔联合承包公司",
    "GM Message | Muhajir AlMuttahida Company For Contracting": "总经理致辞 | 穆哈吉尔联合承包公司",
    "Introduction | Muhajir AlMuttahida Company For Contracting": "公司简介 | 穆哈吉尔联合承包公司",
    "Our Vision & Mission | Muhajir AlMuttahida Company For Contracting": "愿景与使命 | 穆哈吉尔联合承包公司",
    "Profile | Muhajir AlMuttahida Company For Contracting": "公司资料 | 穆哈吉尔联合承包公司"
  };

  var arDictionary = {};

  var arTitleDictionary = {};

  arDictionary = Object.assign(arDictionary, {
    "Muhajir AlMuttahida Company For Contracting": "شركة محاجر المتحدة للمقاولات",
    "Skip to content": "تخط إلى المحتوى",
    "Main Menu": "القائمة الرئيسية",
    "Breadcrumbs": "مسار التنقل",
    "Slider": "شريط الصور",
    "Contact form": "نموذج التواصل",
    "Home": "الرئيسية",
    "Our Company": "شركتنا",
    "Introduction": "مقدمة",
    "GM Message": "رسالة المدير العام",
    "Our Vision & Mission": "رؤيتنا ورسالتنا",
    "Divisions & Factories": "الأقسام والمصانع",
    "Asphalt Plant": "مصنع الأسفلت",
    "Road Painting & Safety Division": "قسم دهانات الطرق والسلامة",
    "Crusher Plant": "مصنع الكسارة",
    "Contracting Division": "قسم المقاولات",
    "Road Contracting Division": "قسم مقاولات الطرق",
    "Profile": "الملف التعريفي",
    "Contact us": "اتصل بنا",
    "Contact Us": "اتصل بنا",
    "Phone Us": "اتصل بنا",
    "Email Us": "البريد الإلكتروني",
    "Our Location": "موقعنا",
    "KSA , JEDDAH": "المملكة العربية السعودية، جدة",
    "Search in Website": "البحث في الموقع",
    "Search": "بحث",
    "Read more": "اقرأ المزيد",
    "Read less": "اقرأ أقل",
    "Back to Home": "العودة للرئيسية",
    "Page Not Found": "الصفحة غير موجودة",
    "Something to say? Get In Touch!": "هل لديك استفسار؟ تواصل معنا",
    "Let's Discuss Your Project": "لنتحدث عن مشروعك",
    "Let’s Discuss Your Project": "لنتحدث عن مشروعك",
    "Letâ€™s Discuss Your Project": "لنتحدث عن مشروعك",
    "Share your inquiry and our team will respond with the right support.": "شاركنا استفسارك وسيرد فريقنا بالدعم المناسب.",
    "Tell us about your requirements, and our team will connect with you promptly to support your next project.": "أخبرنا بمتطلباتك، وسيتواصل فريقنا معك سريعاً لدعم مشروعك القادم.",
    "Complete the form and we will open WhatsApp with your inquiry ready to send.": "أكمل النموذج وسنفتح واتساب مع تجهيز استفسارك للإرسال.",
    "Your Name (required)": "الاسم (مطلوب)",
    "Full name": "الاسم الكامل",
    "Your Email (required)": "البريد الإلكتروني (مطلوب)",
    "Subject": "الموضوع",
    "How can we help?": "كيف يمكننا مساعدتك؟",
    "Your Message": "رسالتك",
    "Write your message here...": "اكتب رسالتك هنا...",
    "Send": "إرسال",
    "Find Us Here": "موقعنا",
    "Contact Infromation": "معلومات التواصل",
    "Contact Information": "معلومات التواصل",
    "Contact Us: ": "اتصل بنا:",
    "Address: ": "العنوان:",
    "P.O. Box: 30094": "صندوق البريد: 30094",
    "Postal Code: 41912": "الرمز البريدي: 41912",
    "Friday: ": "الجمعة:",
    "Saturday: ": "السبت:",
    "Closed": "مغلق",
    "Emails: ": "البريد الإلكتروني:",
    "Call Us: ": "اتصل بنا:",
    "Message from The General Manager": "رسالة المدير العام",
    "Dear Customers and Employees,": "عملاءنا وموظفينا الأعزاء،",
    "Thank you for visiting our website to learn more about our company.": "شكراً لزيارتكم موقعنا للتعرف أكثر على شركتنا.",
    "Sincerely,": "مع خالص التحية،",
    "Building Reliable Value for Every Client": "نبني قيمة موثوقة لكل عميل",
    "Our Vision": "رؤيتنا",
    "Our Mission": "رسالتنا",
    "Our Aim": "هدفنا",
    "Provide customer-driven total solutions.": "تقديم حلول متكاملة مبنية على احتياجات العملاء.",
    "Continuously improve our services, equipment, and workforce capabilities.": "تطوير خدماتنا ومعداتنا وقدرات فريق العمل بشكل مستمر.",
    "Deliver reliable, timely, and responsive service.": "تقديم خدمة موثوقة وفي الوقت المناسب وسريعة الاستجابة.",
    "Create long-term value through high-quality work and responsible growth.": "خلق قيمة طويلة الأمد من خلال جودة العمل والنمو المسؤول.",
    "Company Profile of Muhajir AlMuttahida Company For Contracting": "الملف التعريفي لشركة محاجر المتحدة للمقاولات",
    "View Profile": "عرض الملف",
    "Download Profile": "تحميل الملف",
    "File format: PDF": "صيغة الملف: PDF",
    "previous arrow": "السابق",
    "next arrow": "التالي",
    "► Asphalt Plant": "► مصنع الأسفلت",
    "► Contracting Division": "► قسم المقاولات",
    "► Road Contracting Division": "► قسم مقاولات الطرق",
    "► Road Painting & Safety Division": "► قسم دهانات الطرق والسلامة",
    "► Crusher Plant": "► مصنع الكسارة",
    "► Introduction": "► مقدمة",
    "► GM Message": "► رسالة المدير العام",
    "► Our Vision & Mission": "► رؤيتنا ورسالتنا"
  });

  arDictionary = Object.assign(arDictionary, {
    "Phone Us +966530427457": "اتصل بنا +966530427457",
    "Email Us Info@unitedquarries.com.sa": "البريد الإلكتروني Info@unitedquarries.com.sa",
    "Our Location KSA , JEDDAH": "موقعنا المملكة العربية السعودية، جدة",
    "KSA – Madinah": "المملكة العربية السعودية - المدينة المنورة",
    "Yanbu Alsinaiyah – C6": "ينبع الصناعية - C6",
    "Search for:": "البحث عن:",
    "Email": "البريد الإلكتروني",
    "Email Info@unitedquarries.com.sa": "البريد الإلكتروني Info@unitedquarries.com.sa",
    "Phone": "الهاتف",
    "Phone +966530427457": "الهاتف +966530427457",
    "Location": "الموقع",
    "Location:": "الموقع:",
    "Location KSA , JEDDAH": "الموقع المملكة العربية السعودية، جدة",
    "© 2026 Muhajir AlMuttahida Company For Contracting. All rights reserved.": "© 2026 شركة محاجر المتحدة للمقاولات. جميع الحقوق محفوظة.",
    "Search…": "بحث...",
    "The page you requested is not available.": "الصفحة التي طلبتها غير متوفرة.",
    "We'll get right back to you": "سنرد عليك قريباً",
    "name@example.com": "name@example.com",
    "Contact Us:": "اتصل بنا:",
    "Location: KSA , JEDDAH": "الموقع: المملكة العربية السعودية، جدة",
    "Address:": "العنوان:",
    "Weekday’s:": "أيام العمل:",
    "Sunday – Thursday:": "الأحد - الخميس:",
    "08:00 AM to 05:30 PM": "08:00 صباحاً إلى 05:30 مساءً",
    "Friday:": "الجمعة:",
    "Saturday:": "السبت:",
    "Emails:": "البريد الإلكتروني:",
    "Call Us:": "اتصل بنا:",
    "Contracting Slider -Home": "سلايدر المقاولات - الرئيسية",
    "Project Slider -Home": "سلايدر المشاريع - الرئيسية",
    "Operations Slider -Home": "سلايدر العمليات - الرئيسية",
    "Asphalt and milling plant operations": "عمليات مصنع الأسفلت والكشط",
    "Additional asphalt plant operations view": "عرض إضافي لعمليات مصنع الأسفلت",
    "Access the official company profile to review our background, capabilities, operational strengths, and project experience in one organized document.": "اطلع على الملف التعريفي الرسمي للشركة لمراجعة خلفيتنا وقدراتنا ونقاط قوتنا التشغيلية وخبراتنا في المشاريع ضمن مستند منظم واحد.",
    "Use the options below to open the profile directly in your browser or download a copy for offline review and sharing.": "استخدم الخيارات أدناه لفتح الملف التعريفي مباشرة في المتصفح أو تنزيل نسخة للمراجعة والمشاركة دون اتصال.",
    "Our direction is shaped by quality, dependable delivery, and practical solutions that support construction, asphalt materials, and logistics needs across the Kingdom of Saudi Arabia.": "يتشكل توجهنا من الجودة والتسليم الموثوق والحلول العملية التي تدعم احتياجات الإنشاء ومواد الأسفلت والخدمات اللوجستية في أنحاء المملكة العربية السعودية.",
    "To be the company that best understands customer needs and delivers products and services that consistently earn long-term trust.": "أن نكون الشركة الأكثر فهماً لاحتياجات العملاء، وأن نقدم منتجات وخدمات تكتسب الثقة على المدى الطويل باستمرار.",
    "To be recognized as a leading company in Saudi Arabia for asphalt materials, contracting support, and logistics services.": "أن نكون شركة رائدة ومعترفاً بها في المملكة العربية السعودية في مواد الأسفلت ودعم المقاولات والخدمات اللوجستية.",
    "Is one of the most significant groups in Kingdom of Saudi Arabia, Established in 2013, since its creation, Muhajir AlMuttahida Company For Contracting has been trying to constantly increase and diversify its activities in related field of construction contracting. Since that time both the size and significance of the group have been notably increasing by further investments in New Establishments (Divisions). Presently, the all Muhajir AlMuttahida Company For Contracting divisions count more than 850 employees. The group has a clear strategy of using its collective skills and understanding of markets to develop a unique value proposition to clients.": "تعد شركة محاجر المتحدة للمقاولات من المجموعات المهمة في المملكة العربية السعودية. تأسست عام 2013، ومنذ إنشائها تسعى باستمرار إلى توسيع وتنويع أنشطتها في مجال مقاولات الإنشاء. ومنذ ذلك الوقت ازداد حجم المجموعة وأهميتها بشكل ملحوظ من خلال الاستثمار في منشآت وأقسام جديدة. حالياً تضم أقسام شركة محاجر المتحدة للمقاولات أكثر من 850 موظفاً. تمتلك المجموعة استراتيجية واضحة تقوم على توظيف مهاراتها الجماعية وفهمها للأسواق لتقديم قيمة مميزة للعملاء.",
    "Muhajir AlMuttahida Company For Contracting was established in 2013 having grown and expanded over the last years. The head office is located in KSA , JEDDAH.": "تأسست شركة محاجر المتحدة للمقاولات عام 2013، وقد نمت وتوسعت خلال السنوات الماضية. يقع المكتب الرئيسي في المملكة العربية السعودية، جدة.",
    "When the company was established, the development in the Kingdom was still in its infancy and only a few entrepreneurs were willing to take the risk, or had the ability to form a construction company. However, Muhajir AlMuttahida Company For Contracting succeeded in creating a Saudi Arabian Owned firm capable of performing many diverse projects.": "عند تأسيس الشركة، كان التطور في المملكة لا يزال في بداياته، ولم يكن سوى عدد قليل من رواد الأعمال مستعدين لتحمل المخاطر أو يمتلكون القدرة على تأسيس شركة إنشاءات. ومع ذلك، نجحت شركة محاجر المتحدة للمقاولات في إنشاء شركة سعودية قادرة على تنفيذ مشاريع متنوعة.",
    "Although the company activities in those early years were concentrated on projects related to earth moving and road works only, the VISION of the founder did not end there. Muhajir AlMuttahida Company For Contracting mission is to participate and contribute its expertise in the growing development of the Kingdom. Thus, for its 13 years of existence, Muhajir AlMuttahida Company For Contracting has developed and maintained a large staff of proven technical and management personnel, experienced specialists in the design, planning and construction department, together with sound technical and commercial management teams that ensure efficient and timely execution of any project that it may undertake.": "على الرغم من أن أنشطة الشركة في سنواتها الأولى كانت تتركز على مشاريع أعمال الحفر والطرق فقط، فإن رؤية المؤسس لم تتوقف عند ذلك. تتمثل رسالة شركة محاجر المتحدة للمقاولات في المشاركة والمساهمة بخبراتها في التنمية المتنامية للمملكة. لذلك، وخلال 13 عاماً من وجودها، طورت الشركة وحافظت على فريق كبير من الكفاءات الفنية والإدارية المثبتة، والمتخصصين ذوي الخبرة في التصميم والتخطيط والتنفيذ، إلى جانب فرق إدارة فنية وتجارية قوية تضمن تنفيذ أي مشروع تتولاه بكفاءة وفي الوقت المحدد.",
    "Although the company activities in those early years were concentrated on projects related to earthmoving and road works only, the VISION of the founder did not end there. Muhajir AlMuttahida Company For Contracting mission is to participate and contribute its expertise in the growing development of the Kingdom. Thus, for its 13 years of existence, Muhajir AlMuttahida Company For Contracting has developed and maintained a large staff of proven technical and management personnel, experienced specialists in the design, planning and construction department, together with sound technical and commercial management teams that ensure efficient and timely execution of any project that it may undertake.": "على الرغم من أن أنشطة الشركة في سنواتها الأولى كانت تتركز على مشاريع أعمال الحفر والطرق فقط، فإن رؤية المؤسس لم تتوقف عند ذلك. تتمثل رسالة شركة محاجر المتحدة للمقاولات في المشاركة والمساهمة بخبراتها في التنمية المتنامية للمملكة. لذلك، وخلال 13 عاماً من وجودها، طورت الشركة وحافظت على فريق كبير من الكفاءات الفنية والإدارية المثبتة، والمتخصصين ذوي الخبرة في التصميم والتخطيط والتنفيذ، إلى جانب فرق إدارة فنية وتجارية قوية تضمن تنفيذ أي مشروع تتولاه بكفاءة وفي الوقت المحدد.",
    "Muhajir AlMuttahida Company For Contracting is one of the leading companies in Construction of Roads in the whole region since it is constructed and until nowadays it did many successful completed road projects including Asphalt, Earthwork, Infrastructure, Lighting, Culverts, Sign Boards, Pavement Markings, Rip Rap and all the related work.": "تعد شركة محاجر المتحدة للمقاولات من الشركات الرائدة في إنشاء الطرق على مستوى المنطقة. ومنذ تأسيسها وحتى اليوم أنجزت العديد من مشاريع الطرق الناجحة، بما في ذلك الأسفلت، والأعمال الترابية، والبنية التحتية، والإنارة، والعبارات، واللوحات الإرشادية، وتخطيط الطرق، وأعمال الحماية بالحجارة، وجميع الأعمال ذات الصلة.",
    "At present, the number of our full-time staff and employees exceeds five hundred personnel working at Yanbu. These employees are supported by state-of-the-art Computer Management and Computer Aided Design Systems and utilizing a fleet of plant and equipment.": "في الوقت الحالي يتجاوز عدد موظفينا والعاملين بدوام كامل في ينبع خمسمائة موظف. ويدعم هؤلاء الموظفين أنظمة إدارة حاسوبية وتصميم بمساعدة الحاسوب متطورة، إضافة إلى أسطول من المصانع والمعدات.",
    "Today, Muhajir AlMuttahida Company For Contracting has a successful track record of completing many projects from government and private parties throughout the Kingdom and Muhajir AlMuttahida Company For Contracting is widely known as a very professional firm that can assure clients that they will be utilizing a first-class firm with a professional background, high level of experience and broad capability. Accordingly, our mission continues to be providing excellent professional services to a wider range of customers.": "اليوم تمتلك شركة محاجر المتحدة للمقاولات سجلاً ناجحاً في تنفيذ العديد من المشاريع للجهات الحكومية والخاصة في مختلف أنحاء المملكة. وتعرف الشركة على نطاق واسع كشركة مهنية للغاية، مما يمنح العملاء الثقة بأنهم يتعاملون مع شركة من الدرجة الأولى ذات خلفية مهنية وخبرة عالية وقدرات واسعة. وبناءً على ذلك، تستمر رسالتنا في تقديم خدمات مهنية متميزة لشريحة أوسع من العملاء.",
    "I hope that you find our website informative and I invite you to come back and visit frequently. We are continually updating our site with new and additional information.": "آمل أن تجدوا موقعنا مفيداً، وأدعوكم إلى زيارته باستمرار. نحن نحدث الموقع بشكل مستمر بمعلومات جديدة وإضافية.",
    "We welcome your comments and questions so please do not hesitate to contact us for information, assistance, or to make a recommendation of how we can improve. â€œ": "نرحب بتعليقاتكم وأسئلتكم، فلا تترددوا في التواصل معنا للحصول على المعلومات أو المساعدة أو تقديم اقتراحات تساعدنا على التحسين.",
    "We welcome your comments and questions so please do not hesitate to contact us for information, assistance, or to make a recommendation of how we can improve. Ã¢â‚¬Å“": "نرحب بتعليقاتكم وأسئلتكم، فلا تترددوا في التواصل معنا للحصول على المعلومات أو المساعدة أو تقديم اقتراحات تساعدنا على التحسين.",
    "Our success begins and ends with our staff. I am thankful and proud to be part of a team that is fully committed to working diligently and following safety guidelines. Our vision is to build the â€˜client experienceâ€™ through projects which reflect the values of our family. The process at which we execute our projects from start to finish provides our clients with a memorable and positive experience.": "يبدأ نجاحنا وينتهي بفريق عملنا. أنا ممتن وفخور بكوني جزءاً من فريق ملتزم بالكامل بالعمل بجد واتباع إرشادات السلامة. رؤيتنا هي بناء تجربة العميل من خلال مشاريع تعكس قيم عائلتنا. إن طريقة تنفيذنا للمشاريع من البداية إلى النهاية تمنح عملاءنا تجربة إيجابية لا تنسى.",
    "Our success begins and ends with our staff. I am thankful and proud to be part of a team that is fully committed to working diligently and following safety guidelines. Our vision is to build the Ã¢â‚¬Ëœclient experienceÃ¢â‚¬â„¢ through projects which reflect the values of our family. The process at which we execute our projects from start to finish provides our clients with a memorable and positive experience.": "يبدأ نجاحنا وينتهي بفريق عملنا. أنا ممتن وفخور بكوني جزءاً من فريق ملتزم بالكامل بالعمل بجد واتباع إرشادات السلامة. رؤيتنا هي بناء تجربة العميل من خلال مشاريع تعكس قيم عائلتنا. إن طريقة تنفيذنا للمشاريع من البداية إلى النهاية تمنح عملاءنا تجربة إيجابية لا تنسى.",
    "Since stepping into the role of General Manager a couple of years ago it has been a passion of mine to increase our community involvement as a team. Having a positive effect on our community is important to me and echoes our company values. Within our company, Iâ€™m passionate about building an organization which challenges all of our employees to be the best version of themselves every single day.": "منذ تولي منصب المدير العام قبل عدة سنوات، كان من شغفي زيادة مشاركتنا المجتمعية كفريق. إن ترك أثر إيجابي في مجتمعنا أمر مهم بالنسبة لي ويعكس قيم شركتنا. وداخل الشركة، أحرص على بناء منظمة تحفز جميع موظفينا ليكونوا أفضل نسخة من أنفسهم كل يوم.",
    "Since stepping into the role of General Manager a couple of years ago it has been a passion of mine to increase our community involvement as a team. Having a positive effect on our community is important to me and echoes our company values. Within our company, IÃ¢â‚¬â„¢m passionate about building an organization which challenges all of our employees to be the best version of themselves every single day.": "منذ تولي منصب المدير العام قبل عدة سنوات، كان من شغفي زيادة مشاركتنا المجتمعية كفريق. إن ترك أثر إيجابي في مجتمعنا أمر مهم بالنسبة لي ويعكس قيم شركتنا. وداخل الشركة، أحرص على بناء منظمة تحفز جميع موظفينا ليكونوا أفضل نسخة من أنفسهم كل يوم.",
    "We are leading producer of aggregates, sand & grave/ materials in kingdom of Saudi Arabia, We have our own 07 Crusher Plants in Kingdom. We have 02 different quarries in which we 06 Crusher Plants are from Tele-Smith USA & 01 is from Symon- China, we manufacture products that specifically cater to the construction, ready mix, and asphalt industries,": "نحن من المنتجين الرائدين للركام والرمل ومواد الحصى في المملكة العربية السعودية، ولدينا 7 مصانع كسارات خاصة بنا داخل المملكة. نمتلك محجرين مختلفين، تضم 6 كسارات من Tele-Smith الأمريكية وكسارة واحدة من Symon الصينية، وننتج مواد تلبي بشكل خاص احتياجات قطاعات الإنشاء والخرسانة الجاهزة والأسفلت.",
    "We have complete independent setup along with Diesel Generating sets which are keeping Crushers operational all the time, CAT Brand wheel loaders which are feeding the crushers round the clock & Mercedes trailers which are giving logistic support to supply produced material to all of our customers in Kingdom of Saudi Arabia.": "لدينا تجهيز مستقل متكامل مع مولدات ديزل تبقي الكسارات عاملة طوال الوقت، إضافة إلى شيولات CAT تغذي الكسارات على مدار الساعة، ومقطورات مرسيدس تقدم الدعم اللوجستي لتوريد المواد المنتجة إلى جميع عملائنا في المملكة العربية السعودية.",
    "We enjoy an outstanding reputation in the market for high quality asphalt supply, our asphalt operation has achieved significant growth over the past few years and the company is planning to further enhance resources to accommodate the demand for supplies, both in-house as well as external projects.": "نتمتع بسمعة متميزة في السوق في توريد الأسفلت عالي الجودة. وقد حققت عمليات الأسفلت لدينا نمواً ملحوظاً خلال السنوات الماضية، وتخطط الشركة لتعزيز مواردها بشكل أكبر لتلبية الطلب على التوريد للمشاريع الداخلية والخارجية.",
    "we have just imported one more new asphalt plant from Handa China Now we have the 04 Complete asphalt plants, 01 from Parker & 03 from Handa China, we are producing best quality asphalt & cater the needs of our own road construction division & external customers, No doubt we are the expert of Asphalt technology & trusted name in Kingdom of Saudi Arabia.": "قمنا مؤخراً باستيراد مصنع أسفلت جديد من Handa الصين، وأصبح لدينا الآن 4 مصانع أسفلت متكاملة، واحد من Parker وثلاثة من Handa الصين. ننتج أسفلتاً عالي الجودة ونلبي احتياجات قسم إنشاء الطرق لدينا والعملاء الخارجيين. ولا شك أننا خبراء في تقنية الأسفلت واسم موثوق في المملكة العربية السعودية.",
    "Our Civil Contraction Division has a reputation for professionalism, orginazation experience and technical knowledge. We build strong relationships with consultants, subcontractors and suppliers, which allow us to offer innovative solutions to project challenges that benefit our clients.": "يتمتع قسم المقاولات المدنية لدينا بسمعة في المهنية والخبرة التنظيمية والمعرفة الفنية. نبني علاقات قوية مع الاستشاريين والمقاولين من الباطن والموردين، مما يتيح لنا تقديم حلول مبتكرة لتحديات المشاريع بما يخدم عملاءنا.",
    "We have completed & handed over several projects on time in Kingdom of Saudi Arabia. The Company's strength lies in having a formidable team of well qualified and experienced Managers, Engineers and Technicians capable of Designing, Planning and execution of Projects. The other strength lies in the form of precise Machinery, Equipment & Tools required for proper project execution. We are fully equipped with all necessary equipment. We have a dedicated team of Engineers & Skilled labour in our Civil contracting Division.": "أنجزنا وسلمنا عدة مشاريع في موعدها داخل المملكة العربية السعودية. تكمن قوة الشركة في امتلاك فريق قوي من المديرين والمهندسين والفنيين المؤهلين وذوي الخبرة، القادرين على تصميم المشاريع وتخطيطها وتنفيذها. كما تتمثل قوة أخرى في توفر الآلات والمعدات والأدوات الدقيقة اللازمة للتنفيذ السليم للمشاريع. نحن مجهزون بالكامل بجميع المعدات الضرورية، ولدينا فريق متخصص من المهندسين والعمالة الماهرة في قسم المقاولات المدنية.",
    "Has enjoyed a constant growth since it started operation in 2013 as a road contractor. This road to success has been built with ingenuity, Vast Experience & workmanship, the key factors in the growth and stability of the business are our aggressive management team.": "حقق قسم مقاولات الطرق نمواً مستمراً منذ بدء عمله عام 2013 كمقاول طرق. وقد بني طريق النجاح هذا على الابتكار والخبرة الواسعة وجودة التنفيذ، وكانت الإدارة النشطة من العوامل الأساسية في نمو واستقرار الأعمال.",
    "This team has grown up in the industry and applies a cost effective and timely approach to the completion of each project. Muhajir AlMuttahida Company For Contracting provides exceptional value to our clients by utilizing professional, trusted and pioneering methods. We remain unfazed by the complexity, scale and vastness of any project put forth to us. We undertake any challenge irrespective of size or complexity from the design stage to the final touch. Muhajir AlMuttahida Company For Contracting Road Construction Division owns and operates big fleet of Top Brands of road construction equipment, Like Bulldozers (CAT & Komatsu) , Motor Graders (CAT), all kind & Size of road rollers ( Hamm, Dynapac, CAT, Bomag Milling machines (Wirtgen) , Paving Machines (VÃ–GELE) & Wheel Loaders (CAT), As we mentioned above that we have our own Asphalt Plants & Crushers which are feeding round the clock to our road Construction division, We have comprehensive solution under one Roof, Our dedicated team of Engineers & skilled workers are always ready to handle any road construction & maintenance job.": "نشأ هذا الفريق داخل القطاع ويطبق نهجاً فعالاً من حيث التكلفة والوقت لإنجاز كل مشروع. تقدم شركة محاجر المتحدة للمقاولات قيمة استثنائية لعملائها من خلال أساليب مهنية وموثوقة ورائدة. لا تثنينا صعوبة أي مشروع أو حجمه أو اتساع نطاقه. نتولى أي تحد مهما كان حجمه أو تعقيده من مرحلة التصميم وحتى اللمسات النهائية. يمتلك قسم إنشاء الطرق في شركة محاجر المتحدة للمقاولات ويشغل أسطولاً كبيراً من معدات إنشاء الطرق من أفضل العلامات، مثل بلدوزرات CAT وKomatsu، وجريدرات CAT، وجميع أنواع وأحجام الرصاصات من Hamm وDynapac وCAT وBomag، وماكينات الكشط Wirtgen، وفراشات الأسفلت VOGELE، وشيولات CAT. وكما ذكرنا، لدينا مصانع أسفلت وكسارات خاصة بنا تغذي قسم إنشاء الطرق على مدار الساعة. نقدم حلاً متكاملاً تحت سقف واحد، وفريقنا المتخصص من المهندسين والعمال المهرة جاهز دائماً للتعامل مع أعمال إنشاء الطرق وصيانتها.",
    "This team has grown up in the industry and applies a cost effective and timely approach to the completion of each project. Muhajir AlMuttahida Company For Contracting provides exceptional value to our clients by utilizing professional, trusted and pioneering methods. We remain unfazed by the complexity, scale and vastness of any project put forth to us. We undertake any challenge irrespective of size or complexity from the design stage to the final touch. Muhajir AlMuttahida Company For Contracting Road Construction Division owns and operates big fleet of Top Brands of road construction equipment, Like Bulldozers (CAT & Komatsu) , Motor Graders (CAT), all kind & Size of road rollers ( Hamm, Dynapac, CAT, Bomag Milling machines (Wirtgen) , Paving Machines (VÃƒâ€“GELE) & Wheel Loaders (CAT), As we mentioned above that we have our own Asphalt Plants & Crushers which are feeding round the clock to our road Construction division, We have comprehensive solution under one Roof, Our dedicated team of Engineers & skilled workers are always ready to handle any road construction & maintenance job.": "نشأ هذا الفريق داخل القطاع ويطبق نهجاً فعالاً من حيث التكلفة والوقت لإنجاز كل مشروع. تقدم شركة محاجر المتحدة للمقاولات قيمة استثنائية لعملائها من خلال أساليب مهنية وموثوقة ورائدة. لا تثنينا صعوبة أي مشروع أو حجمه أو اتساع نطاقه. نتولى أي تحد مهما كان حجمه أو تعقيده من مرحلة التصميم وحتى اللمسات النهائية. يمتلك قسم إنشاء الطرق في شركة محاجر المتحدة للمقاولات ويشغل أسطولاً كبيراً من معدات إنشاء الطرق من أفضل العلامات، مثل بلدوزرات CAT وKomatsu، وجريدرات CAT، وجميع أنواع وأحجام الرصاصات من Hamm وDynapac وCAT وBomag، وماكينات الكشط Wirtgen، وفراشات الأسفلت VOGELE، وشيولات CAT. وكما ذكرنا، لدينا مصانع أسفلت وكسارات خاصة بنا تغذي قسم إنشاء الطرق على مدار الساعة. نقدم حلاً متكاملاً تحت سقف واحد، وفريقنا المتخصص من المهندسين والعمال المهرة جاهز دائماً للتعامل مع أعمال إنشاء الطرق وصيانتها.",
    "As we have the road construction contracting division from 2013 & performance is superb, then the company establish our own division for Road Marking and Traffic Safety Solution. Which has earned a remarkable reputation in trustworthiness, all because of a strong customer-focused approaches": "نظراً لامتلاكنا قسم مقاولات إنشاء الطرق منذ عام 2013 وأدائه المتميز، أنشأت الشركة قسماً خاصاً لتخطيط الطرق وحلول السلامة المرورية. وقد اكتسب هذا القسم سمعة بارزة في الموثوقية بفضل النهج القوي المتمحور حول العملاء.",
    "and the continuous quest for world class quality maintaining, We have 04 Hofmann Road Marking Machines Which Consider state of the art machines in road paint technology, We have complete dedicated well experience team For Road marking Jobs.": "ومع السعي المستمر للحفاظ على جودة عالمية، نمتلك 4 ماكينات Hofmann لتخطيط الطرق، وهي من أحدث الماكينات في تقنية دهانات الطرق. ولدينا فريق متخصص ومتمرس بالكامل لأعمال تخطيط الطرق."
  });

  arTitleDictionary = Object.assign(arTitleDictionary, {
    "Muhajir AlMuttahida Company For Contracting": "شركة محاجر المتحدة للمقاولات",
    "Page Not Found | Muhajir AlMuttahida Company For Contracting": "الصفحة غير موجودة | شركة محاجر المتحدة للمقاولات",
    "Contact Us | Muhajir AlMuttahida Company For Contracting": "اتصل بنا | شركة محاجر المتحدة للمقاولات",
    "Crusher Plant | Muhajir AlMuttahida Company For Contracting": "مصنع الكسارة | شركة محاجر المتحدة للمقاولات",
    "Divisions & Factories | Muhajir AlMuttahida Company For Contracting": "الأقسام والمصانع | شركة محاجر المتحدة للمقاولات",
    "Asphalt Plant | Muhajir AlMuttahida Company For Contracting": "مصنع الأسفلت | شركة محاجر المتحدة للمقاولات",
    "Contracting Division | Muhajir AlMuttahida Company For Contracting": "قسم المقاولات | شركة محاجر المتحدة للمقاولات",
    "Road Contracting Division | Muhajir AlMuttahida Company For Contracting": "قسم مقاولات الطرق | شركة محاجر المتحدة للمقاولات",
    "Road Painting & Safety Division | Muhajir AlMuttahida Company For Contracting": "قسم دهانات الطرق والسلامة | شركة محاجر المتحدة للمقاولات",
    "Our Company | Muhajir AlMuttahida Company For Contracting": "شركتنا | شركة محاجر المتحدة للمقاولات",
    "GM Message | Muhajir AlMuttahida Company For Contracting": "رسالة المدير العام | شركة محاجر المتحدة للمقاولات",
    "Introduction | Muhajir AlMuttahida Company For Contracting": "مقدمة | شركة محاجر المتحدة للمقاولات",
    "Our Vision & Mission | Muhajir AlMuttahida Company For Contracting": "رؤيتنا ورسالتنا | شركة محاجر المتحدة للمقاولات",
    "Profile | Muhajir AlMuttahida Company For Contracting": "الملف التعريفي | شركة محاجر المتحدة للمقاولات"
  });

  function getDictionary(language) {
    if (language === "zh") {
      return dictionary;
    }
    if (language === "ar") {
      return arDictionary;
    }
    return {};
  }

  function getTitleDictionary(language) {
    if (language === "zh") {
      return titleDictionary;
    }
    if (language === "ar") {
      return arTitleDictionary;
    }
    return {};
  }


  function normalize(text) {
    return String(text || "").replace(/\s+/g, " ").trim();
  }

  function normalizeLanguage(language) {
    if (language === "zh" || language === "zh-CN") {
      return "zh";
    }
    if (language === "ar" || language === "ar-SA") {
      return "ar";
    }
    return DEFAULT_LANGUAGE;
  }

  function getReverseDictionary(language) {
    if (!reverseDictionaries[language]) {
      reverseDictionaries[language] = {};
      var source = getDictionary(language);
      Object.keys(source).forEach(function (key) {
        reverseDictionaries[language][normalize(source[key])] = key;
      });
    }

    return reverseDictionaries[language];
  }

  function getCanonicalText(text) {
    var normalized = normalize(text);

    if (getDictionary("zh")[normalized] || getDictionary("ar")[normalized]) {
      return normalized;
    }

    return getReverseDictionary("zh")[normalized] || getReverseDictionary("ar")[normalized] || normalized;
  }

  function translateString(text, language) {
    var original = String(text || "");
    var leading = original.match(/^\s*/)[0];
    var trailing = original.match(/\s*$/)[0];
    var canonical = getCanonicalText(original);

    if (language === DEFAULT_LANGUAGE) {
      return leading + canonical + trailing;
    }

    var translated = getDictionary(language)[canonical];
    if (translated) {
      return leading + translated + trailing;
    }

    var body = original.slice(leading.length, original.length - trailing.length);
    var changed = false;
    Object.keys(getDictionary(language)).sort(function (a, b) {
      return b.length - a.length;
    }).forEach(function (key) {
      var value = getDictionary(language)[key];
      if (body.indexOf(key) !== -1) {
        body = body.split(key).join(value);
        changed = true;
      }
    });

    return changed ? leading + body + trailing : original;
  }

  function rememberOriginal(node, attr) {
    var key = attr ? "i18nOriginal" + attr : "i18nOriginalText";
    if (!node.dataset[key]) {
      node.dataset[key] = attr ? node.getAttribute(attr) || "" : node.nodeValue;
    }
    return node.dataset[key];
  }

  function translateTextNode(node, language) {
    var original = node.__i18nOriginalText || node.nodeValue;
    var canonical = getCanonicalText(original);
    if (canonical !== normalize(original)) {
      original = node.nodeValue.replace(normalize(node.nodeValue), canonical);
    }
    node.__i18nOriginalText = original;

    node.nodeValue = translateString(original, language);
  }

  function translateAttributes(language) {
    var selectors = "input[placeholder], textarea[placeholder], input[value], button[value], img[alt], [title], [aria-label], [data-title], [data-alt]";
    document.querySelectorAll(selectors).forEach(function (element) {
      ["placeholder", "value", "alt", "title", "aria-label", "data-title", "data-alt"].forEach(function (attr) {
        if (!element.hasAttribute(attr)) {
          return;
        }

        var original = rememberOriginal(element, attr);
        element.setAttribute(attr, translateString(original, language));
      });
    });
  }

  function translateContactForm(language) {
    var labels = contactFormLabels[language] || contactFormLabels[DEFAULT_LANGUAGE];
    var form = document.querySelector(".wpcf7-form");

    if (!form) {
      return;
    }

    var nameField = form.querySelector('[name="your-name"]');
    var emailField = form.querySelector('[name="your-email"]');
    var subjectField = form.querySelector('[name="your-subject"]');
    var messageField = form.querySelector('[name="your-message"]');
    var submitButton = form.querySelector('input[type="submit"], button[type="submit"]');

    if (nameField) {
      nameField.setAttribute("placeholder", labels.namePlaceholder);
    }
    if (emailField) {
      emailField.setAttribute("placeholder", labels.emailPlaceholder);
    }
    if (subjectField) {
      subjectField.setAttribute("placeholder", labels.subjectPlaceholder);
    }
    if (messageField) {
      messageField.setAttribute("placeholder", labels.messagePlaceholder);
    }
    if (submitButton) {
      if (submitButton.tagName.toLowerCase() === "input") {
        submitButton.value = labels.submit;
        submitButton.setAttribute("value", labels.submit);
      } else {
        submitButton.textContent = labels.submit;
      }
    }
  }

  function applyLanguageDirection(language) {
    var direction = languageDirections[language] || languageDirections[DEFAULT_LANGUAGE];
    var htmlLang = language === "zh" ? "zh-CN" : language === "ar" ? "ar-SA" : "en-US";

    document.documentElement.lang = htmlLang;
    document.documentElement.dir = direction;
    document.documentElement.setAttribute("data-site-language", language);
    document.documentElement.classList.toggle("is-language-ar", language === "ar");
    document.documentElement.classList.toggle("is-language-zh", language === "zh");
    document.documentElement.classList.toggle("is-language-en", language === DEFAULT_LANGUAGE);

    if (document.body) {
      document.body.dir = direction;
      document.body.setAttribute("data-site-language", language);
      document.body.classList.toggle("is-language-ar", language === "ar");
      document.body.classList.toggle("is-language-zh", language === "zh");
      document.body.classList.toggle("is-language-en", language === DEFAULT_LANGUAGE);
    }

    document.querySelectorAll(".site-content, .entry-content, .textwidget, .widget, .main-navigation, #quick-contact, .footer-contact-grid, .wpcf7-form").forEach(function (element) {
      element.dir = direction;
    });
  }

  function translateDocument(language) {
    language = normalizeLanguage(language);
    currentLanguage = language;
    isTranslating = true;
    if (translationObserver) {
      translationObserver.disconnect();
    }
    applyLanguageDirection(language);

    var originalTitle = document.documentElement.dataset.i18nOriginalTitle || document.title;
    document.documentElement.dataset.i18nOriginalTitle = originalTitle;
    document.title = language === DEFAULT_LANGUAGE ? originalTitle : getTitleDictionary(language)[normalize(originalTitle)] || originalTitle;

    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!normalize(node.nodeValue)) {
          return NodeFilter.FILTER_REJECT;
        }

        var parent = node.parentElement;
        if (!parent || parent.closest("script, style, noscript, .uq-language-switcher")) {
          return NodeFilter.FILTER_REJECT;
        }

        return NodeFilter.FILTER_ACCEPT;
      }
    });

    var nodes = [];
    while (walker.nextNode()) {
      nodes.push(walker.currentNode);
    }

    nodes.forEach(function (node) {
      translateTextNode(node, language);
    });

    translateAttributes(language);
    translateContactForm(language);
    updateSwitcher(language);
    window.setTimeout(function () {
      updateSwitcher(currentLanguage);
    }, 0);
    isTranslating = false;
    if (translationObserver && document.body) {
      translationObserver.observe(document.body, observerOptions);
    }
  }

  function scheduleTranslation() {
    if (isTranslating || currentLanguage === DEFAULT_LANGUAGE) {
      return;
    }

    window.clearTimeout(pendingTranslation);
    pendingTranslation = window.setTimeout(function () {
      translateDocument(currentLanguage);
    }, 40);
  }

  function updateSwitcher(language) {
    language = normalizeLanguage(language || currentLanguage || localStorage.getItem(STORAGE_KEY) || document.documentElement.lang);
    var labelText = languageLabels[language] || languageLabels[DEFAULT_LANGUAGE];
    var ariaLabel = languageSelectorLabels[language] || languageSelectorLabels[DEFAULT_LANGUAGE];

    document.querySelectorAll(".uq-language-switcher").forEach(function (switcher) {
      switcher.setAttribute("aria-label", ariaLabel);
      switcher.setAttribute("data-current-language", language);
      switcher.dir = "ltr";
      var label = switcher.querySelector("label");
      if (label) {
        label.dir = languageDirections[language] || languageDirections[DEFAULT_LANGUAGE];
        label.textContent = labelText;
      }
    });

    document.querySelectorAll(".uq-language-switcher select").forEach(function (select) {
      var optionLabels = languageOptionLabels[language] || languageOptionLabels[DEFAULT_LANGUAGE];
      select.innerHTML = [
        '<option value="en">' + optionLabels.en + '</option>',
        '<option value="zh">' + optionLabels.zh + '</option>',
        '<option value="ar">' + optionLabels.ar + '</option>'
      ].join("");
      select.value = language;
      if (select.value !== language) {
        var options = Array.prototype.slice.call(select.options);
        var index = options.findIndex(function (option) {
          return option.value === language;
        });
        if (index >= 0) {
          select.selectedIndex = index;
        }
      }
      Array.prototype.forEach.call(select.options, function (option) {
        option.selected = option.value === language;
        if (option.selected) {
          option.setAttribute("selected", "selected");
        } else {
          option.removeAttribute("selected");
        }
      });
      select.dir = languageDirections[language] || languageDirections[DEFAULT_LANGUAGE];
      select.setAttribute("aria-label", ariaLabel);
    });
  }

  function setLanguage(language) {
    var nextLanguage = normalizeLanguage(language);
    localStorage.setItem(STORAGE_KEY, nextLanguage);
    updateSwitcher(nextLanguage);
    translateDocument(nextLanguage);
  }

  function addStyles() {
    if (document.getElementById("uq-language-switcher-style")) {
      return;
    }

    var style = document.createElement("style");
    style.id = "uq-language-switcher-style";
    style.textContent = [
      "#site-navigation .wrap-menu-content{position:relative;padding-left:170px}",
      ".uq-language-switcher{display:inline-flex;align-items:center;gap:8px;padding:4px 6px;border:1px solid rgba(255,255,255,.38);border-radius:4px;background:rgba(0,0,0,.18);direction:ltr!important;vertical-align:middle}",
      "#site-navigation .uq-language-switcher{position:absolute;left:0;top:50%;transform:translateY(-50%);margin:0}",
      ".uq-language-switcher label{color:#fff;font-size:13px;font-weight:700;line-height:1;white-space:nowrap}",
      ".uq-language-switcher select{height:30px;min-width:112px;padding:0 28px 0 10px;border:0;border-radius:3px;background:#fff;color:#123;font-size:13px;font-weight:700;cursor:pointer}",
      ".uq-language-switcher select:focus{outline:2px solid #fff;outline-offset:2px}",
      "@media (min-width:1024px){.mobile-nav-wrap .uq-language-switcher{display:none}}",
      "html[dir='rtl'] #site-navigation .wrap-menu-content{padding-left:170px;padding-right:0}",
      "html[dir='rtl'] #site-navigation .uq-language-switcher{left:0;right:auto}",
      "html[dir='rtl'] .uq-language-switcher select{padding:0 10px 0 28px}",
      "@media (max-width:991px){#site-navigation .wrap-menu-content{padding-left:150px}html[dir='rtl'] #site-navigation .wrap-menu-content{padding-left:150px;padding-right:0}.uq-language-switcher select{min-width:84px}}",
      "@media (max-width:767px){#site-navigation .wrap-menu-content{padding-left:0}html[dir='rtl'] #site-navigation .wrap-menu-content{padding-left:0;padding-right:0}.uq-language-switcher{margin:10px 0 0 0}#site-navigation .uq-language-switcher{position:static;transform:none}}",
      "html[dir='rtl'],html[dir='rtl'] body{direction:rtl!important;text-align:right}",
      "html[dir='ltr'],html[dir='ltr'] body{direction:ltr!important;text-align:left}",
      "html[dir='rtl'] .site-content,html[dir='rtl'] .entry-content,html[dir='rtl'] .textwidget,html[dir='rtl'] .widget,html[dir='rtl'] #primary .site-main article .entry-content,html[dir='rtl'] .wpb_text_column,html[dir='rtl'] .vc_column-inner{text-align:right!important;direction:rtl!important}",
      "html[dir='ltr'] .site-content,html[dir='ltr'] .entry-content,html[dir='ltr'] .textwidget,html[dir='ltr'] .widget,html[dir='ltr'] #primary .site-main article .entry-content,html[dir='ltr'] .wpb_text_column,html[dir='ltr'] .vc_column-inner{text-align:left!important;direction:ltr!important}",
      "html[dir='rtl'] .site-branding,html[dir='rtl'] #quick-contact,html[dir='rtl'] .main-navigation,html[dir='rtl'] .footer-contact-item,html[dir='rtl'] .sidebar .widget-title{text-align:right!important}",
      "html[dir='ltr'] .site-branding,html[dir='ltr'] #quick-contact,html[dir='ltr'] .main-navigation,html[dir='ltr'] .footer-contact-item,html[dir='ltr'] .sidebar .widget-title{text-align:left!important}",
      "html[dir='rtl'] #quick-contact{float:right!important}",
      "html[dir='ltr'] #quick-contact{float:left!important}",
      "html[dir='rtl'] #quick-contact li{float:right!important;text-align:right!important;margin-left:0!important;margin-right:40px!important;padding-left:0!important;padding-right:35px!important}",
      "html[dir='ltr'] #quick-contact li{float:left!important;text-align:left!important;margin-left:40px!important;margin-right:0!important;padding-left:35px!important;padding-right:0!important}",
      "html[dir='rtl'] #quick-contact li::before{left:auto!important;right:-10px!important}",
      "html[dir='ltr'] #quick-contact li::before{left:-10px!important;right:auto!important}",
      "html[dir='rtl'] .main-navigation > div > ul > li,html[dir='rtl'] .main-navigation .menu-header-menu-container > ul.menu > li{float:right!important}",
      "html[dir='ltr'] .main-navigation > div > ul > li,html[dir='ltr'] .main-navigation .menu-header-menu-container > ul.menu > li{float:left!important}",
      "html[dir='rtl'] .main-navigation > div > ul > li:first-child,html[dir='rtl'] .main-navigation .menu-header-menu-container > ul.menu > li:first-child{padding-left:22px!important;padding-right:0!important}",
      "html[dir='ltr'] .main-navigation > div > ul > li:first-child,html[dir='ltr'] .main-navigation .menu-header-menu-container > ul.menu > li:first-child{padding-left:0!important;padding-right:22px!important}",
      "html[dir='rtl'] .main-navigation ul ul{left:auto!important;right:0!important;text-align:right!important}",
      "html[dir='ltr'] .main-navigation ul ul{left:0!important;right:auto!important;text-align:left!important}",
      "html[dir='rtl'] .main-navigation ul ul ul{left:auto!important;right:114%!important;border-left:0!important;border-right:1px solid #f7f7f76b!important}",
      "html[dir='ltr'] .main-navigation ul ul ul{left:114%!important;right:auto!important;border-left:1px solid #f7f7f76b!important;border-right:0!important}",
      "html[dir='rtl'] .main-navigation ul ul,html[dir='ltr'] .main-navigation ul ul{min-width:260px!important;width:max-content!important;max-width:min(360px,calc(100vw - 32px))!important;padding:0!important}",
      "html[dir='rtl'] .main-navigation ul ul li,html[dir='ltr'] .main-navigation ul ul li{float:none!important;display:block!important;width:100%!important;clear:both!important;margin:0!important;padding:0!important}",
      "html[dir='rtl'] .main-navigation ul ul li:first-child,html[dir='ltr'] .main-navigation ul ul li:first-child{padding:0!important}",
      "html[dir='rtl'] .main-navigation ul ul a{text-align:right!important}",
      "html[dir='ltr'] .main-navigation ul ul a{text-align:left!important}",
      "html[dir='rtl'] .main-navigation ul ul a,html[dir='ltr'] .main-navigation ul ul a{display:block!important;width:100%!important;white-space:normal!important;line-height:1.45!important;padding:13px 18px!important}",
      "html[dir='rtl'] .main-navigation > div > ul > li.menu-item-has-children > a,html[dir='rtl'] .main-navigation > div > ul > li.page_item_has_children > a,html[dir='rtl'] .main-navigation .menu-header-menu-container > ul.menu > li.menu-item-has-children > a,html[dir='rtl'] .main-navigation .menu-header-menu-container > ul.menu > li.page_item_has_children > a{padding-left:18px!important;padding-right:0!important}",
      "html[dir='ltr'] .main-navigation > div > ul > li.menu-item-has-children > a,html[dir='ltr'] .main-navigation > div > ul > li.page_item_has_children > a,html[dir='ltr'] .main-navigation .menu-header-menu-container > ul.menu > li.menu-item-has-children > a,html[dir='ltr'] .main-navigation .menu-header-menu-container > ul.menu > li.page_item_has_children > a{padding-left:0!important;padding-right:18px!important}",
      "html[dir='rtl'] .main-navigation ul ul li.menu-item-has-children > a,html[dir='rtl'] .main-navigation ul ul li.page_item_has_children > a{padding-left:30px!important;padding-right:18px!important}",
      "html[dir='ltr'] .main-navigation ul ul li.menu-item-has-children > a,html[dir='ltr'] .main-navigation ul ul li.page_item_has_children > a{padding-left:18px!important;padding-right:30px!important}",
      "html[dir='rtl'] .main-navigation > div > ul > li.menu-item-has-children > a::after,html[dir='rtl'] .main-navigation > div > ul > li.page_item_has_children > a::after,html[dir='rtl'] .main-navigation .menu-header-menu-container > ul.menu > li.menu-item-has-children > a::after,html[dir='rtl'] .main-navigation .menu-header-menu-container > ul.menu > li.page_item_has_children > a::after{left:0!important;right:auto!important;margin-left:0!important;margin-right:10px!important}",
      "html[dir='ltr'] .main-navigation > div > ul > li.menu-item-has-children > a::after,html[dir='ltr'] .main-navigation > div > ul > li.page_item_has_children > a::after,html[dir='ltr'] .main-navigation .menu-header-menu-container > ul.menu > li.menu-item-has-children > a::after,html[dir='ltr'] .main-navigation .menu-header-menu-container > ul.menu > li.page_item_has_children > a::after{left:auto!important;right:0!important;margin-left:10px!important;margin-right:0!important}",
      "html[dir='rtl'] .main-navigation ul ul li.menu-item-has-children > a::after,html[dir='rtl'] .main-navigation ul ul li.page_item_has_children > a::after{left:12px!important;right:auto!important}",
      "html[dir='ltr'] .main-navigation ul ul li.menu-item-has-children > a::after,html[dir='ltr'] .main-navigation ul ul li.page_item_has_children > a::after{left:auto!important;right:12px!important}",
      "html[dir='rtl'] .main-navigation ul li li.menu-item-has-children > a::after,html[dir='rtl'] .main-navigation ul li li.page_item_has_children > a::after{content:'\\f0d9'!important}",
      "html[dir='ltr'] .main-navigation ul li li.menu-item-has-children > a::after,html[dir='ltr'] .main-navigation ul li li.page_item_has_children > a::after{content:'\\f0da'!important}",
      "html[dir='rtl'] #masthead .container,html[dir='rtl'] .site-header .container{direction:ltr!important}",
      "html[dir='rtl'] .site-branding,html[dir='rtl'] .custom-logo-link{float:left!important;text-align:left!important}",
      "html[dir='rtl'] .custom-logo-link{margin-left:0!important;margin-right:15px!important}",
      "html[dir='rtl'] .right-head{direction:ltr!important;float:right!important;text-align:left!important}",
      "html[dir='rtl'] #quick-contact{float:none!important;direction:ltr!important;text-align:left!important}",
      "html[dir='rtl'] #quick-contact > ul,html[dir='rtl'] .quick-contact-list{direction:ltr!important;justify-content:flex-end!important}",
      "html[dir='rtl'] #quick-contact li,html[dir='rtl'] #quick-contact li:first-child{float:left!important;text-align:left!important;margin-left:40px!important;margin-right:0!important;padding-left:35px!important;padding-right:0!important;direction:rtl!important}",
      "html[dir='rtl'] #quick-contact li::before,html[dir='rtl'] #quick-contact li.quick-email::before{left:-10px!important;right:auto!important}",
      "html[dir='rtl'] #quick-contact a{direction:ltr!important;text-align:left!important}",
      "html[dir='rtl'] input,html[dir='rtl'] textarea,html[dir='rtl'] select{direction:rtl!important;text-align:right!important}",
      "html[dir='ltr'] input,html[dir='ltr'] textarea,html[dir='ltr'] select{direction:ltr!important;text-align:left!important}",
      "html[dir='rtl'] .uq-language-switcher select,html[dir='ltr'] .uq-language-switcher select{text-align:start!important}",
      "html[dir='rtl'] .footer-contact-grid,html[dir='rtl'] #quick-contact > ul{direction:rtl!important}",
      "html[dir='ltr'] .footer-contact-grid,html[dir='ltr'] #quick-contact > ul{direction:ltr!important}",
      "html[dir='rtl'] .wpcf7-form,html[dir='rtl'] .post-364 .wpcf7-form,html[dir='rtl'] .uq-whatsapp-modal__dialog{text-align:right!important;direction:rtl!important}",
      "html[dir='ltr'] .wpcf7-form,html[dir='ltr'] .post-364 .wpcf7-form,html[dir='ltr'] .uq-whatsapp-modal__dialog{text-align:left!important;direction:ltr!important}",
      "html[dir='rtl'] .post-364 .wpcf7-form{direction:rtl!important}",
      "html[dir='ltr'] .post-364 .wpcf7-form{direction:ltr!important}",
      "html[dir='rtl'] .post-364 .wpcf7-form p,html[dir='rtl'] .post-364 .wpcf7-form label{text-align:right!important;direction:rtl!important}",
      "html[dir='ltr'] .post-364 .wpcf7-form p,html[dir='ltr'] .post-364 .wpcf7-form label{text-align:left!important;direction:ltr!important}",
      "html[dir='rtl'] .post-364 .wpcf7 input[type='submit']{margin-left:0!important;margin-right:auto!important;text-align:center!important}",
      "html[dir='ltr'] .post-364 .wpcf7 input[type='submit']{margin-left:auto!important;margin-right:0!important;text-align:center!important}",
      "@media (max-width:1023px){.mobile-nav-wrap{align-items:center!important;display:flex!important;gap:8px!important;justify-content:space-between!important}.mobile-nav-wrap .uq-language-switcher{flex:0 0 auto!important;margin:0!important;max-width:calc(100vw - 150px)!important;order:2!important}.mobile-nav-wrap .uq-language-switcher label{font-size:12px!important}.mobile-nav-wrap .uq-language-switcher select{height:30px!important;min-width:94px!important;max-width:118px!important}a#mobile-trigger{align-items:center!important;display:inline-flex!important;gap:8px!important;min-width:0!important;order:1!important;padding:7px 8px!important;white-space:nowrap!important}#mobile-trigger i{margin:0!important}html[dir='rtl'] .mobile-nav-wrap{direction:rtl!important;text-align:right!important}html[dir='rtl'] .mobile-nav-wrap .uq-language-switcher{order:2!important}html[dir='rtl'] .mobile-nav-wrap #mobile-trigger{flex-direction:row-reverse!important;order:1!important}html[dir='ltr'] .mobile-nav-wrap{direction:ltr!important;text-align:left!important}html[dir='ltr'] .mobile-nav-wrap .uq-language-switcher{order:2!important}html[dir='ltr'] .mobile-nav-wrap #mobile-trigger{flex-direction:row!important;order:1!important}}",
      "@media (max-width:420px){a#mobile-trigger{font-size:13px!important;gap:6px!important;padding-left:6px!important;padding-right:6px!important}.mobile-nav-wrap .uq-language-switcher label{font-size:11px!important}.mobile-nav-wrap .uq-language-switcher select{min-width:82px!important;max-width:96px!important}}",
      ".main-navigation .menu-header-menu-container > ul.menu > li > a{position:relative!important;transition:background-color .22s ease,color .22s ease,box-shadow .22s ease,transform .22s ease!important}",
      ".main-navigation .menu-header-menu-container > ul.menu > li > a::before{transition:width .24s ease,opacity .24s ease,background-color .24s ease!important}",
      ".main-navigation .menu-header-menu-container > ul.menu > li:hover > a,.main-navigation .menu-header-menu-container > ul.menu > li:focus-within > a,.main-navigation .menu-header-menu-container > ul.menu > li > a:hover,.main-navigation .menu-header-menu-container > ul.menu > li > a:focus{background:rgba(255,255,255,.09)!important;color:#fff!important;box-shadow:inset 0 -3px 0 #c9bd4d!important;transform:translateY(-1px)!important}",
      ".main-navigation .menu-header-menu-container > ul.menu > li.current-menu-item > a,.main-navigation .menu-header-menu-container > ul.menu > li.current_page_item > a{box-shadow:inset 0 -3px 0 #ffffff!important}",
      ".main-navigation .menu-header-menu-container > ul.menu ul.sub-menu{background:#fff!important;border:1px solid rgba(18,52,86,.12)!important;box-shadow:0 14px 34px rgba(0,0,0,.16)!important;overflow:hidden!important}",
      ".main-navigation .menu-header-menu-container > ul.menu ul.sub-menu a{border-inline-start:3px solid transparent!important;color:#143a5a!important;transition:background-color .2s ease,color .2s ease,border-color .2s ease,padding .2s ease!important}",
      ".main-navigation .menu-header-menu-container > ul.menu ul.sub-menu li:hover > a,.main-navigation .menu-header-menu-container > ul.menu ul.sub-menu li:focus-within > a,.main-navigation .menu-header-menu-container > ul.menu ul.sub-menu a:hover,.main-navigation .menu-header-menu-container > ul.menu ul.sub-menu a:focus{background:#f3f7fa!important;border-inline-start-color:#c9bd4d!important;color:#0d4778!important}",
      "html[dir='rtl'] .main-navigation .menu-header-menu-container > ul.menu ul.sub-menu a{border-inline-start:0!important;border-inline-end:3px solid transparent!important}",
      "html[dir='rtl'] .main-navigation .menu-header-menu-container > ul.menu ul.sub-menu li:hover > a,html[dir='rtl'] .main-navigation .menu-header-menu-container > ul.menu ul.sub-menu li:focus-within > a,html[dir='rtl'] .main-navigation .menu-header-menu-container > ul.menu ul.sub-menu a:hover,html[dir='rtl'] .main-navigation .menu-header-menu-container > ul.menu ul.sub-menu a:focus{border-inline-end-color:#c9bd4d!important}",
      "@media (prefers-reduced-motion:reduce){.main-navigation .menu-header-menu-container > ul.menu > li > a,.main-navigation .menu-header-menu-container > ul.menu ul.sub-menu a{transition:none!important}.main-navigation .menu-header-menu-container > ul.menu > li:hover > a,.main-navigation .menu-header-menu-container > ul.menu > li:focus-within > a,.main-navigation .menu-header-menu-container > ul.menu > li > a:hover,.main-navigation .menu-header-menu-container > ul.menu > li > a:focus{transform:none!important}}",
      "@media (min-width:1024px){.main-navigation .menu-header-menu-container > ul.menu{align-items:stretch!important;display:flex!important;float:none!important;gap:6px!important;justify-content:center!important;min-height:58px!important}.main-navigation .menu-header-menu-container > ul.menu > li{display:flex!important;float:none!important;padding:0!important;position:relative!important}.main-navigation .menu-header-menu-container > ul.menu > li > a{align-items:center!important;display:flex!important;justify-content:center!important;min-width:145px!important;padding:0 22px!important;text-align:center!important;white-space:nowrap!important}.main-navigation .menu-header-menu-container > ul.menu > li.menu-item-has-children > a,.main-navigation .menu-header-menu-container > ul.menu > li.page_item_has_children > a{padding-inline-end:34px!important}.main-navigation .menu-header-menu-container > ul.menu > li.menu-item-has-children > a::after,.main-navigation .menu-header-menu-container > ul.menu > li.page_item_has_children > a::after{inset-inline-end:16px!important;inset-inline-start:auto!important;top:50%!important;transform:translateY(-55%)!important}.main-navigation .menu-header-menu-container > ul.menu > li > ul.sub-menu{left:0!important;right:auto!important;top:100%!important;min-width:285px!important;width:max-content!important;max-width:min(380px,calc(100vw - 32px))!important;padding:8px 0!important;transform:scale(1,0)!important;transform-origin:top!important}.main-navigation .menu-header-menu-container > ul.menu > li:hover > ul.sub-menu,.main-navigation .menu-header-menu-container > ul.menu > li:focus-within > ul.sub-menu{opacity:1!important;transform:scale(1,1)!important}.main-navigation .menu-header-menu-container > ul.menu ul.sub-menu li{clear:both!important;display:block!important;float:none!important;margin:0!important;padding:0!important;width:100%!important}.main-navigation .menu-header-menu-container > ul.menu ul.sub-menu a{display:block!important;line-height:1.45!important;padding:12px 18px!important;white-space:normal!important;width:100%!important}html[dir='rtl'] .main-navigation .menu-header-menu-container > ul.menu{direction:rtl!important}html[dir='ltr'] .main-navigation .menu-header-menu-container > ul.menu{direction:ltr!important}html[dir='rtl'] .main-navigation .menu-header-menu-container > ul.menu > li > ul.sub-menu{left:auto!important;right:0!important;text-align:right!important}html[dir='ltr'] .main-navigation .menu-header-menu-container > ul.menu > li > ul.sub-menu{left:0!important;right:auto!important;text-align:left!important}html[dir='rtl'] .main-navigation .menu-header-menu-container > ul.menu ul.sub-menu a{text-align:right!important;direction:rtl!important}html[dir='ltr'] .main-navigation .menu-header-menu-container > ul.menu ul.sub-menu a{text-align:left!important;direction:ltr!important}}"
    ].join("");
    document.head.appendChild(style);
  }

  function createSwitcher(id) {
    var wrapper = document.createElement("div");
    wrapper.className = "uq-language-switcher";
    wrapper.setAttribute("aria-label", "Language selector");
    wrapper.innerHTML = '<label for="' + id + '">Languages</label><select id="' + id + '"><option value="en">English</option><option value="zh">Chinese</option><option value="ar">Arabic</option></select>';
    wrapper.addEventListener("change", function (event) {
      if (event.target && event.target.matches("select")) {
        setLanguage(event.target.value);
      }
    });
    return wrapper;
  }

  function insertSwitcher() {
    var navigation = document.querySelector("#site-navigation .wrap-menu-content") || document.querySelector("#site-navigation");
    if (navigation && !navigation.querySelector(".uq-language-switcher")) {
      navigation.insertBefore(createSwitcher("uq-language-select"), navigation.firstChild);
    }

    var mobileNav = document.querySelector(".mobile-nav-wrap");
    if (mobileNav && !mobileNav.querySelector(".uq-language-switcher")) {
      mobileNav.insertBefore(createSwitcher("uq-language-select-mobile"), mobileNav.firstChild);
    }

    if (!navigation && !mobileNav && !document.querySelector(".uq-language-switcher")) {
      document.body.insertBefore(createSwitcher("uq-language-select"), document.body.firstChild);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    addStyles();
    insertSwitcher();
    setLanguage(localStorage.getItem(STORAGE_KEY) || DEFAULT_LANGUAGE);
    if (window.MutationObserver) {
      translationObserver = new MutationObserver(scheduleTranslation);
      translationObserver.observe(document.body, observerOptions);
    }
  });

  document.addEventListener("change", function (event) {
    if (event.target && event.target.matches(".uq-language-switcher select")) {
      setLanguage(event.target.value);
    }
  });

  window.addEventListener("pageshow", function () {
    updateSwitcher(localStorage.getItem(STORAGE_KEY) || currentLanguage || DEFAULT_LANGUAGE);
  });
})();
