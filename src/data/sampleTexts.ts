export interface SampleScript {
  id: string;
  title: string;
  language: 'vi-VN' | 'en-US';
  styleId: string;
  voiceId: string;
  category: string;
  content: string;
}

export const SAMPLE_SCRIPTS: SampleScript[] = [
  {
    id: 'vi_mc_gala',
    title: 'Dẫn chương trình Gala Công nghệ',
    language: 'vi-VN',
    styleId: 'mc_host',
    voiceId: 'Kore',
    category: 'Sự kiện / MC',
    content: 'Chào mừng toàn thể quý vị đại biểu và các vị khách quý đã có mặt tại đêm Gala Đổi Mới Sáng Tạo 2026. Hôm nay, chúng ta cùng hội tụ tại đây để tôn vinh những bước tiến đột phá của trí tuệ nhân tạo và công nghệ giọng nói tương lai.',
  },
  {
    id: 'vi_news_tech',
    title: 'Bản tin Chuyển đổi số Quốc gia',
    language: 'vi-VN',
    styleId: 'news_anchor',
    voiceId: 'Charon',
    category: 'Thời sự / Tin tức',
    content: 'Bản tin phát thanh 18 giờ. Bộ Thông tin và Truyền thông vừa công bố chiến lược phát triển hạ tầng dữ liệu quốc gia giai đoạn mới. Mục tiêu đặt trọng tâm vào phổ cập công nghệ xử lý ngôn ngữ tự nhiên tiếng Việt cho mọi nền tảng số.',
  },
  {
    id: 'vi_inspirational',
    title: 'Truyền cảm hứng khởi nghiệp',
    language: 'vi-VN',
    styleId: 'inspirational',
    voiceId: 'Puck',
    category: 'Động lực',
    content: 'Mỗi dòng code bạn viết hôm nay không chỉ là thuật toán, mà là cánh cửa mở ra những điều kỳ diệu cho hàng triệu người. Đừng bao giờ sợ thất bại, bởi sự vĩ đại luôn bắt đầu từ những bước chân kiên định nhất!',
  },
  {
    id: 'vi_story_fairy',
    title: 'Truyện kể: Khu vườn bí ẩn',
    language: 'vi-VN',
    styleId: 'storytelling',
    voiceId: 'Zephyr',
    category: 'Kể chuyện',
    content: 'Đêm đã khuya, khi ánh trăng bàng bạc chiếu qua kẽ lá, chú đom đóm nhỏ mới cất cánh bay. Trong khu rừng yên ả, từng giọt sương đêm rơi lách tách trên phiến lá sen, bắt đầu một câu chuyện cổ tích chưa từng được kể.',
  },
  {
    id: 'vi_language_slow',
    title: 'Luyện phát âm thanh điệu tiếng Việt',
    language: 'vi-VN',
    styleId: 'language_learning',
    voiceId: 'Zephyr',
    category: 'Giáo dục',
    content: 'Tiếng Việt có sáu thanh điệu: ngang, huyền, sắc, hỏi, ngã, nặng. Xin mời các bạn cùng lắng nghe và nhắc lại theo từng nhịp: Ba, Bà, Bá, Bả, Bã, Bạ. Hãy chú ý mở rộng khẩu hình miệng và giữ hơi thở thật đều.',
  },
  {
    id: 'en_presentation_keynote',
    title: 'AI Product Launch Keynote',
    language: 'en-US',
    styleId: 'presentation',
    voiceId: 'Kore',
    category: 'Keynote',
    content: 'Good morning, everyone. Today, we are thrilled to introduce the next leap in acoustic synthesis. By uniting neural acoustic models with human prosody, we are making human-quality narration accessible to every creator worldwide.',
  },
  {
    id: 'en_news_broadcast',
    title: 'Morning Financial Dispatch',
    language: 'en-US',
    styleId: 'news_anchor',
    voiceId: 'Charon',
    category: 'Broadcast',
    content: 'This is the global market briefing. Global tech indices rallied today following unprecedented breakthroughs in multi-modal generative infrastructure. Treasury yields held steady as enterprise adoption accelerated across the Americas and Asia.',
  },
  {
    id: 'en_short_form_hook',
    title: 'Viral Tech Creator Hook',
    language: 'en-US',
    styleId: 'short_form',
    voiceId: 'Puck',
    category: 'Social Video',
    content: 'Stop scrolling! What if I told you that in less than thirty seconds, your plain text can transform into a studio-grade voiceover ready for Spotify or YouTube? Check this out right now!',
  },
  {
    id: 'en_audiobook_novel',
    title: 'Atmospheric Novel Chapter',
    language: 'en-US',
    styleId: 'audiobook',
    voiceId: 'Fenrir',
    category: 'Audiobook',
    content: 'The old lighthouse stood defiant against the tempestuous Atlantic tides. Inside the spiral staircase, damp stone echoed with the distant howling of the autumn wind, carrying whispers of sailors from a century long forgotten.',
  },
];
