const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Token extends Model {
  // Static method to get token list in Uniswap format
  static async getTokenList(chainId) {
    const tokens = await this.findAll({ where: { chainId } });
    
    return {
      name: 'Uniswap Simple Token List',
      logoURI: '',
      keywords: ['uniswap', 'simple', 'default'],
      timestamp: new Date().toISOString(),
      version: {
        major: 1,
        minor: 0,
        patch: 0
      },
      tokens: tokens.map(token => ({
        chainId: token.chainId,
        address: token.address,
        name: token.name,
        symbol: token.symbol,
        decimals: token.decimals,
        logoURI: token.logoURI || ''
      }))
    };
  }
}

Token.init({
  // Token address (primary key)
  address: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    validate: {
      isLowercase: true,
      is: /^0x[a-f0-9]{40}$/i
    },
    set(value) {
      this.setDataValue('address', value.toLowerCase());
    }
  },
  
  // Token name
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  
  // Token symbol
  symbol: {
    type: DataTypes.STRING,
    allowNull: false
  },
  
  // Token decimals
  decimals: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 18
  },
  
  // Chain ID
  chainId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'chain_id'
  },
  
  // Logo URI (optional)
  logoURI: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Token',
  tableName: 'tokens',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['address']
    },
    {
      unique: true,
      fields: ['symbol', 'chain_id']
    }
  ]
});

module.exports = Token;
