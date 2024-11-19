// global.d.ts (hoặc trong file .ts hiện tại nếu không muốn tạo file riêng)
declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

export {};