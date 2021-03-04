export default {
  sanitizeForSearch(str) {
    return str.toLowerCase().replace(/[^0-9a-z%]/g, '');
  },

  compress(fileOrUrl, format = 'png', compression = 0.9, width, height) {
    return new Promise((resolve, reject) => {
      try {
        const img = new Image();

        let isFile = false;
        if (fileOrUrl instanceof File) {
          isFile = true;
          img.src = URL.createObjectURL(fileOrUrl);
        } else {
          img.src = fileOrUrl;
          img.crossOrigin = 'Anonymous';
        }

        img.onload = () => {
          const canvas = document.createElement('canvas');

          let scaledWidth = img.width;
          let scaledHeight = img.height;
          if (width && height) {
            if (width > height) {
              scaledWidth = Math.floor(img.width * (height / img.height));
              scaledHeight = height;
            } else {
              scaledWidth = width;
              scaledHeight = Math.floor(img.height * (width / img.width));
            }
          }

          canvas.width = scaledWidth;
          canvas.height = scaledHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
          canvas.toBlob((blob) => {
            if (isFile) {
              URL.revokeObjectURL(img.src);
            }
            resolve(new File([blob], `image.${format}`));
          }, `image/${format}`, compression);
        };
      } catch (e) {
        reject();
      }
    });
  },

  thumbnailify(fileOrUrl) {
    return this.compress(fileOrUrl, 'webp', 0.8, 200, 200);
  },
};
