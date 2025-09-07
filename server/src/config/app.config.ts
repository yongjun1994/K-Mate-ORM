// 애플리케이션 설정
export default () => ({
  app: {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.APP_PORT, 10) || 3000,
  },
});
