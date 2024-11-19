import * as z from 'zod';

const formSchema = z.object({
    title: z.string().min(2, {
        message: 'Tên phải có ít nhất 2 ký tự.',
    }),
    content: z.string().min(10, {
        message: 'Nội dung phải có ít nhất 10 ký tự.',
    }),
    image: z.string().url({ message: 'Hãy tải ảnh lên' }),
    userId: z.string().default(''),
});

export default formSchema;