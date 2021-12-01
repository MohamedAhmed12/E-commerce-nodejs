const oneSizeSizeChart = {
  name: 'one_size',
  sizes: ['One Size'],
};

const sizeChartsForReadyToWear = [
  oneSizeSizeChart,
  {
    name: 'general',
    sizes: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    name: 'french',
    sizes: ['34', '36', '38', '40', '42', '44', '46'],
  },
  {
    name: 'italian',
    sizes: ['38', '40', '42', '44', '46', '48'],
  },
  {
    name: 'us',
    sizes: ['0', '2', '4', '6', '8', '10', '12', '14'],
  },
  {
    name: 'uk',
    sizes: ['4', '6', '8', '10', '12', '14', '16', '18'],
  },
];

const sizeChartsForShoes = [
  {
    name: 'uk',
    sizes: ['3', '3.5', '4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8'],
  },
  {
    name: 'eu',
    sizes: [
      '35',
      '35.5',
      '36',
      '36.5',
      '37',
      '37.5',
      '38',
      '38.5',
      '39',
      '39.5',
      '40',
      '40.5',
      '41',
      '41.5',
      '42',
      '42.5',
    ],
  },
  {
    name: 'us',
    sizes: [
      '5',
      '5.5',
      '6',
      '6.5',
      '7',
      '7.5',
      '8',
      '8.5',
      '9',
      '9.5',
      '10',
      '10.5',
    ],
  },
];

const sizeChartsForBags = [oneSizeSizeChart];
const sizeChartsForJewelry = [oneSizeSizeChart];
const sizeChartsForAccessories = [oneSizeSizeChart];

export const PredefinedProductCategoriesWithSizeCharts = [
  {
    name: 'ready_to_wear',
    subCategories: [
      {
        name: 'activewear',
        sizeCharts: sizeChartsForReadyToWear,
      },
      {
        name: 'beachwear',
        sizeCharts: sizeChartsForReadyToWear,
      },
      {
        name: 'bridal',
        sizeCharts: sizeChartsForReadyToWear,
      },
      {
        name: 'coats',
        sizeCharts: sizeChartsForReadyToWear,
      },
      {
        name: 'dresses',
        sizeCharts: sizeChartsForReadyToWear,
      },
      {
        name: 'evening',
        sizeCharts: sizeChartsForReadyToWear,
      },
      {
        name: 'jackets',
        sizeCharts: sizeChartsForReadyToWear,
      },
      {
        name: 'jeans',
        sizeCharts: sizeChartsForReadyToWear,
      },
      {
        name: 'jumpsuits',
        sizeCharts: sizeChartsForReadyToWear,
      },
      {
        name: 'knitwear',
        sizeCharts: sizeChartsForReadyToWear,
      },
      {
        name: 'lingerie',
        sizeCharts: sizeChartsForReadyToWear,
      },
      {
        name: 'loungewear',
        sizeCharts: sizeChartsForReadyToWear,
      },
      {
        name: 'pants',
        sizeCharts: sizeChartsForReadyToWear,
      },
      {
        name: 'shorts',
        sizeCharts: sizeChartsForReadyToWear,
      },
      {
        name: 'skirts',
        sizeCharts: sizeChartsForReadyToWear,
      },
      {
        name: 'suits',
        sizeCharts: sizeChartsForReadyToWear,
      },
      {
        name: 'swimwear',
        sizeCharts: sizeChartsForReadyToWear,
      },
      {
        name: 'tops',
        sizeCharts: sizeChartsForReadyToWear,
      },
    ],
  },
  {
    name: 'shoes',
    subCategories: [
      {
        name: 'boots',
        sizeCharts: sizeChartsForShoes,
      },
      {
        name: 'flats',
        sizeCharts: sizeChartsForShoes,
      },
      {
        name: 'heels',
        sizeCharts: sizeChartsForShoes,
      },
      {
        name: 'sandals',
        sizeCharts: sizeChartsForShoes,
      },
      {
        name: 'sneakers',
        sizeCharts: sizeChartsForShoes,
      },
    ],
    productMaterials: ['Leather'],
  },
  {
    name: 'bags',
    subCategories: [
      {
        name: 'clutch_bags',
        sizeCharts: sizeChartsForBags,
      },
      {
        name: 'shoulder_bags',
        sizeCharts: sizeChartsForBags,
      },
      {
        name: 'mini_bags',
        sizeCharts: sizeChartsForBags,
      },
      {
        name: 'tote_bags',
        sizeCharts: sizeChartsForBags,
      },
      {
        name: 'travel_bags',
        sizeCharts: sizeChartsForBags,
      },
    ],
  },
  {
    name: 'jewelry',
    subCategories: [
      {
        name: 'costume_jewelry',
        sizeCharts: sizeChartsForJewelry,
      },
      {
        name: 'fine_jewelry',
        sizeCharts: sizeChartsForJewelry,
      },
      {
        name: 'demi_fine_jewelry',
        sizeCharts: sizeChartsForJewelry,
      },
      {
        name: 'watches',
        sizeCharts: sizeChartsForJewelry,
      },
    ],
  },
  {
    name: 'accessories',
    subCategories: [
      {
        name: 'belts',
        sizeCharts: sizeChartsForAccessories,
      },
      {
        name: 'gloves',
        sizeCharts: sizeChartsForAccessories,
      },
      {
        name: 'hair_accessories',
        sizeCharts: sizeChartsForAccessories,
      },
      {
        name: 'hats',
        sizeCharts: sizeChartsForAccessories,
      },
      {
        name: 'scarves',
        sizeCharts: sizeChartsForAccessories,
      },
      {
        name: 'sunglasses',
        sizeCharts: sizeChartsForAccessories,
      },
      {
        name: 'wallets',
        sizeCharts: sizeChartsForAccessories,
      },
    ],
  },
];

export const PredefinedBrandBadges = [
  'instant_hit',
  'new',
  'celebrity_favorite',
  'sustainability',
  'ethical_production',
  'local_craftsmanship',
];

export const PredefinedProductColors = [
  'black',
  'blue',
  'brown',
  'burgundy',
  'green',
  'grey',
  'silver',
  'gold',
  'neutral',
  'orange',
  'pink',
  'purple',
  'red',
  'white',
  'yellow',
  'multicolour',
];

export const PredefinedSizeStandards = [
  {
    name: 'RU',
    sizes: ['40', '42', '44', '46', '48', '50', '52', '54'],
  },
  {
    name: 'EUR',
    sizes: ['34', '36', '38', '40', '42', '44', '46', '48'],
  },
];
