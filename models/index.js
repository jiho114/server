const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
});

const db = {};

// 모델 파일들을 동적으로 불러와 sequelize와 연결합니다.
fs.readdirSync(__dirname)
  .filter((file) => file !== 'index.js' && file.endsWith('.js')) // index.js 제외하고 .js 파일만 필터
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

// 관계 설정 (모델 간 관계가 있다면 여기서 처리)
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// 동기화 (모든 모델을 동기화)
sequelize.sync()
  .then(() => console.log('Database synchronized'))
  .catch((error) => console.error('Error syncing database:', error));

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
