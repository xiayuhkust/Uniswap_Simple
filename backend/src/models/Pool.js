const { DataTypes, Model, Op } = require('sequelize');
const { sequelize } = require('../config/database');

class Pool extends Model {
  // Get fee percent
  getFeePercent() {
    return this.fee / 10000;
  }
  
  // Static method to find pools by token address
  static async findByTokenAddress(tokenAddress) {
    const normalizedAddress = tokenAddress.toLowerCase();
    return this.findAll({
      where: {
        [Op.or]: [
          { token0Address: normalizedAddress },
          { token1Address: normalizedAddress }
        ]
      },
      include: ['token0', 'token1'],
      order: [['createdAt', 'DESC']]
    });
  }
  
  // Static method to find pool by token addresses and fee
  static async findByTokenAddressesAndFee(token0Address, token1Address, fee) {
    const normalizedToken0 = token0Address.toLowerCase();
    const normalizedToken1 = token1Address.toLowerCase();
    
    // Try both token orderings
    return this.findOne({
      where: {
        [Op.or]: [
          {
            token0Address: normalizedToken0,
            token1Address: normalizedToken1,
            fee
          },
          {
            token0Address: normalizedToken1,
            token1Address: normalizedToken0,
            fee
          }
        ]
      },
      include: ['token0', 'token1']
    });
  }
}

Pool.init({
  // Pool address (primary key)
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
  
  // Token0 address
  token0Address: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'token0_address',
    validate: {
      isLowercase: true,
      is: /^0x[a-f0-9]{40}$/i
    },
    set(value) {
      this.setDataValue('token0Address', value.toLowerCase());
    }
  },
  
  // Token1 address
  token1Address: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'token1_address',
    validate: {
      isLowercase: true,
      is: /^0x[a-f0-9]{40}$/i
    },
    set(value) {
      this.setDataValue('token1Address', value.toLowerCase());
    }
  },
  
  // Fee tier (500 = 0.05%, 3000 = 0.3%, 10000 = 1%)
  fee: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isIn: [[500, 3000, 10000]]
    }
  },
  
  // Tick spacing
  tickSpacing: {
    type: DataTypes.INTEGER,
    field: 'tick_spacing',
    allowNull: false
  },
  
  // Square root price X96
  sqrtPriceX96: {
    type: DataTypes.STRING,
    field: 'sqrt_price_x96',
    allowNull: true,
    defaultValue: '0'
  },
  
  // Current liquidity
  liquidity: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '0'
  },
  
  // Current tick
  tick: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  
  // 24h volume
  volume24h: {
    type: DataTypes.STRING,
    field: 'volume24h',
    allowNull: true,
    defaultValue: '0'
  },
  
  // Weekly volume
  volumeWeek: {
    type: DataTypes.STRING,
    field: 'volume_week',
    allowNull: true,
    defaultValue: '0'
  },
  
  // Total volume
  volumeTotal: {
    type: DataTypes.STRING,
    field: 'volume_total',
    allowNull: true,
    defaultValue: '0'
  },
  
  // Total fees
  feesTotal: {
    type: DataTypes.STRING,
    field: 'fees_total',
    allowNull: true,
    defaultValue: '0'
  },
  
  // Transaction count
  txCount: {
    type: DataTypes.INTEGER,
    field: 'tx_count',
    allowNull: true,
    defaultValue: 0
  },
  
  // Created at block number
  createdAtBlock: {
    type: DataTypes.INTEGER,
    field: 'created_at_block',
    allowNull: true
  },
  
  // Initialized flag
  initialized: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  sequelize,
  modelName: 'Pool',
  tableName: 'pools',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['address']
    },
    {
      unique: true,
      fields: ['token0_address', 'token1_address', 'fee']
    },
    {
      fields: ['token0_address']
    },
    {
      fields: ['token1_address']
    }
  ]
});

module.exports = Pool;
