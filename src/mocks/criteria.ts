import type { Criterion } from "../types/criterion";
import n1AgeImg from "../assets/criteria/n1_age.png";
import n2WbcImg from "../assets/criteria/n2_wbc.png";
import n3GlucoseImg from "../assets/criteria/n3_glucose.png";
import n4LdhImg from "../assets/criteria/n4_ldh.png";
import n5AstImg from "../assets/criteria/n5_ast.png";

export const mockCriteria: Criterion[] = [
  {
    id: 1,
    code: "№1",
    name: "Оценка возраста пациента",
    description: "Возраст > 55 лет — критерий при поступлении.",
    duration: "1 календарный день",
    home_visit: true,
    image_url: n1AgeImg,
    status: "active",
    unit: "лет",
    ref_low: null,
    ref_high: null,
  },
  {
    id: 2,
    code: "№2",
    name: "Анализ лейкоцитов крови",
    description:
      "Повышение лейкоцитов может указывать на выраженный воспалительный процесс (критерий: > 16 000/мм³).",
    duration: "1 календарный день",
    home_visit: true,
    image_url: n2WbcImg,
    status: "active",
    unit: "/мм³",
    ref_low: null,
    ref_high: null,
  },
  {
    id: 3,
    code: "№3",
    name: "Измерение уровня глюкозы",
    description:
      "Гипергликемия — один из ранних критериев (критерий: > 200 мг/дл ≈ 11,1 ммоль/л).",
    duration: "1 календарный день",
    home_visit: true,
    image_url: n3GlucoseImg,
    status: "active",
    unit: "мг/дл",
    ref_low: null,
    ref_high: null,
  },
  {
    id: 4,
    code: "№4",
    name: "Определение уровня ЛДГ",
    description: "ЛДГ > 350 МЕ/л — критерий тяжести.",
    duration: "1 календарный день",
    home_visit: true,
    image_url: n4LdhImg,
    status: "active",
    unit: "Ед/л",
    ref_low: null,
    ref_high: null,
  },
  {
    id: 5,
    code: "№5",
    name: "Анализ активности АСТ",
    description: "АСТ > 250 МЕ/л — критерий тяжести.",
    duration: "1 календарный день",
    home_visit: true,
    image_url: n5AstImg,
    status: "active",
    unit: "Ед/л",
    ref_low: 0,
    ref_high: 0,
  },
];