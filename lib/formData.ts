export const objToFormData = (data: object): FormData => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === "object" && item !== null) {
          Object.entries(item).forEach(([subKey, subValue]) => {
            formData.append(`${key}[${index}][${subKey}]`, String(subValue));
          });
        } else {
          formData.append(`${key}[${index}]`, item);
        }
      });
    } else {
      formData.append(key, value);
    }
  });
  return formData;
};
