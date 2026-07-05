const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const calculator = document.querySelector("[data-calculator]");
const leadForm = document.querySelector("[data-lead-form]");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    nav.classList.toggle("is-open");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("is-open"));
  });
}

if (calculator) {
  const hoursInput = calculator.querySelector('input[name="hours"]');
  const hoursLabel = calculator.querySelector("[data-hours-label]");
  const result = calculator.querySelector("[data-result]");
  const spaceSelect = calculator.querySelector('select[name="space"]');

  const spaceMultiplier = {
    flat: 1,
    house: 1.25,
    business: 1.45
  };

  const getPackage = (energy) => {
    if (energy <= 2600) {
      return {
        name: "Base Home",
        description: "Компактна система для зв'язку, ноутбука, освітлення та базової техніки."
      };
    }

    if (energy <= 6200) {
      return {
        name: "Family Reserve",
        description: "Збалансоване рішення для дому з котлом, насосом або холодильником."
      };
    }

    return {
      name: "Workline Pro",
      description: "Потужніший пакет для бізнесу або об'єктів з високим навантаженням."
    };
  };

  const updateCalculator = () => {
    const hours = Number(hoursInput.value);
    const checkedDevices = [...calculator.querySelectorAll('input[name="devices"]:checked')];
    const watts = checkedDevices.reduce((sum, input) => sum + Number(input.value), 0);
    const adjustedWatts = Math.max(120, Math.round(watts * spaceMultiplier[spaceSelect.value]));
    const energy = adjustedWatts * hours;
    const recommendation = getPackage(energy);

    hoursLabel.textContent = `${hours} ${hours === 1 ? "година" : hours < 5 ? "години" : "годин"}`;
    result.innerHTML = `
      <span>Рекомендація</span>
      <strong>${recommendation.name}</strong>
      <p>Орієнтовно ${(adjustedWatts / 1000).toFixed(1)} кВт навантаження і ${(energy / 1000).toFixed(1)} кВт*год ємності. ${recommendation.description}</p>
    `;
  };

  calculator.addEventListener("input", updateCalculator);
  updateCalculator();
}

if (leadForm) {
  const phoneInput = leadForm.querySelector('input[name="phone"]');
  const status = leadForm.querySelector("[data-form-status]");

  phoneInput.addEventListener("input", () => {
    const digits = phoneInput.value.replace(/\D/g, "").slice(0, 12);
    const normalized = digits.startsWith("380") ? digits : `380${digits.replace(/^0/, "")}`;
    const parts = [
      normalized.slice(0, 3),
      normalized.slice(3, 5),
      normalized.slice(5, 8),
      normalized.slice(8, 10),
      normalized.slice(10, 12)
    ].filter(Boolean);

    phoneInput.value = `+${parts.join(" ")}`;
  });

  leadForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = leadForm.elements.name.value.trim();
    const phoneDigits = leadForm.elements.phone.value.replace(/\D/g, "");

    status.className = "form-status";

    if (name.length < 2 || phoneDigits.length < 12) {
      status.textContent = "Перевірте ім'я та номер телефону.";
      status.classList.add("is-error");
      return;
    }

    status.textContent = "Дякуємо! У реальному проєкті ця заявка пішла б у CRM або Telegram.";
    status.classList.add("is-success");
    leadForm.reset();
  });
}
