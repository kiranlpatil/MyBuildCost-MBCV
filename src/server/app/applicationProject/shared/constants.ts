class Constants {
  public static SQUREFEET_UNIT: string = 'sqft';
  public static SQUREMETER_UNIT: string = 'sqmt';
  public static AMENITIES : string = 'amenities';
  public static BUILDING : string = 'building';
  public static SQUARE_METER : string = 'SqureMeter';
  public static RATE_ANALYSIS_API : string = 'rateAnalysisAPI.';
  public static RATE_ANALYSIS_COSTHEADS : string = 'CostHeads';
  public static RATE_ANALYSIS_CATEGORIES : string = 'Categories';
  public static RATE_ANALYSIS_WORKITEMS : string = 'WorkItems';
  public static RATE_ANALYSIS_RATE : string = 'Rate';
  public static RATE_ANALYSIS_NOTES : string = 'RateAnalysisNotes';
  public static RATE_ANALYSIS_UNIT : string = 'Unit';
  public static RATE_ANALYSIS_ITEM_TYPE : string = 'ItemType';
  public static RATE_ANALYSIS_SUBITEM_TYPE : string = 'SubItemType';
  public static RATE_ANALYSIS_ITEMS : string = 'Items';
  public static RATE_ANALYSIS_DATA : string = 'RateAnalysisData';
  public static RATE_ANALYSIS_UOM : string = 'UOM';
  public static THUMBRULE_RATE : string = 'thumbRuleRate';

  public static BUDGETED_COST_FORMULAE : string = 'budgetedCostFormulae.';
  public static CARPET_AREA : string = 'carpetArea';
  public static TOTAL_CARPET_AREA : string = 'totalCarpetAreaOfUnit';
  public static SLAB_AREA : string = 'slabArea';
  public static TOTAL_SLAB_AREA : string = 'totalSlabArea';
  public static SALEABLE_AREA : string = 'saleableArea';
  public static TOTAL_SALEABLE_AREA : string = 'totalSaleableAreaOfUnit';
  public static PLINTH_AREA : string = 'plinthArea';
  public static NUM_OF_ONE_BHK : string = 'numOfOneBHK';
  public static NUM_OF_TWO_BHK : string = 'numOfTwoBHK';
  public static NUM_OF_THREE_BHK : string = 'numOfThreeBHK';
  public static NUM_OF_FOUR_BHK : string = 'numOfFourBHK';
  public static NUM_OF_FIVE_BHK : string = 'numOfFiveBHK';
  public static NUM_OF_FLOORS : string = 'numOfFloors';
  public static NUM_OF_LIFTS : string = 'numOfLifts';
  public static NUM_OF_PARKING_FLOORS : string = 'numOfParkingFloors';
  public static TOTAL_SLAB_AREA_OF_CLUB_HOUSE : string = 'totalSlabAreaOfClubHouse';
  public static SWIMMING_POOL_CAPACITY : string = 'swimmingPoolCapacity';

  //Common Ammenities Cost Heads
  public static SAFETY_MEASURES : string = 'Safety measures';
  public static CLUB_HOUSE : string = 'Club House';
  public static SWIMMING_POOL : string = 'Swimming Pool';

  //Building Cost Heads
  public static RCC_BAND_OR_PATLI : string = 'RCC band / patli';
  public static EXTERNAL_PLASTER : string = 'External plaster';
  public static FABRICATION : string = 'Fabrication';
  public static PAINTING : string = 'Painting';
  public static KITCHEN_OTTA : string = 'Kitchen otta';
  public static SOLING : string = 'Soling';
  public static MASONRY : string = 'Masonry';
  public static INTERNAL_PLASTER : string = 'Internal Plaster';
  public static GYPSUM_OR_POP_PLASTER : string = 'Gypsum / POP plaster (punning)';
  public static WATER_PROOFING : string = 'Water proofing';
  public static DEWATERING : string = 'Dewatering';
  public static GARBAGE_CHUTE : string = 'Garbage chute';
  public static LIFT : string = 'Lift';
  public static DOORS : string = 'Doors';
  public static DADO_OR_WALL_TILING : string = 'Dado / wall tiling';
  public static FLOORING : string = 'Flooring';

  // Value Constant
  public static NUMBER_OF_FRACTION_DIGIT = 2;

  //STR Constants
  public static STR_ALL_BUILDING = 'All Buildings';
  public static STR_EMPTY = '';
  public static STR_COMMA_SPACE = ', ';
  public static STR_DOUBLE_INVERTED_COMMA = '" ';
  public static STR_AND = ' AND ';

  //ALSQL uses constants
  public static ALASQL_FROM = ' FROM ? ';
  public static ALASQL_GROUP_BY_MATERIAL_TAKEOFF_MATERIAL_WISE = 'GROUP BY buildingName, workItemName, quantityName, unit ';
  public static ALASQL_ORDER_BY_MATERIAL_TAKEOFF_MATERIAL_WISE = 'ORDER BY buildingName, workItemName,quantityName ';
  public static ALASQL_SELECT_MATERIAL_TAKEOFF_MATERIAL_WISE =
    'SELECT buildingName AS header, workItemName AS rowValue, SUM(quantity) AS Total, unit ';
  public static ALASQL_SELECT_QUANTITY_NAME_AS = ' quantityName AS subValue ';
  public static ALASQL_WHERE_MATERIAL_NAME_EQUALS_TO = 'WHERE materialName = "';
  public static ALASQL_SELECT_BUILDING_NAME = ' buildingName = "';
}
export=Constants;
