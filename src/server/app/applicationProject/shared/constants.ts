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
  public static COST_HEAD_CLONE='Cost Head';
  public static WORK_ITEM_CLONE='Work Item';
  public static CATEGORY_CLONE='Category';
  public static RATE_ANALYSIS_CLONE='Rate Analysis';
  public static QUANTITY_CLONE : string = 'Quantity';


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
  public static PROJECT_PERIPHERRY : string = 'projectPeriphery';
  public static NUM_OF_PARKING_FLOORS : string = 'numOfParkingFloors';
  public static TOTAL_SLAB_AREA_OF_CLUB_HOUSE : string = 'totalSlabAreaOfClubHouse';
  public static SWIMMING_POOL_CAPACITY : string = 'swimmingPoolCapacity';

  public static TOTAL_NUM_OF_BUILDINGS : string = 'numOfBuildings';

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
  public static DOORS : string = 'Door Frames';
  public static DADO_OR_WALL_TILING : string = 'Dado / wall tiling';
  public static FLOORING : string = 'Flooring';
  public static EXCAVATION : string = 'Excavation';
  public static BACKFILLING_PLINTH : string = 'Backfilling (plinth)';
  public static FLOORING_SKIRTING_WALL_TILING_DADO : string = 'Flooring + skirting + wall tiling (Dado)';
  public static WINDOWS_SILLS_OR_JAMBS : string = 'Window sills / jambs';
  public static DOORS_WITH_FRAMES_AND_HARDWARE : string = 'Doors with frames and hardware';
  public static WINDOWS_AND_GLASS_DOORS : string = 'Windows and Glass doors';
  public static ELECTRIFICATION : string = 'Electrification';
  public static PLUMBING : string = 'External plumbing / drainage line';
  public static ELECTRICAL_LIGHT_FITTINGS_IN_COMMON_AREAS : string = 'Electrical light fittings in common areas of building';
  public static PEST_CONTROL : string = 'Pest Control';
  public static SOLAR_WATER_HEATING_SYSTEM : string = 'Solar water heating system';
  public static PIPED_GAS_SYSTEM : string = 'Piped gas system';
  public static SKY_LOUNGE_ON_TOP_TERRACE : string = 'Sky lounge on top terrace';
  public static FIRE_FIGHTING_SYSTEM : string = 'Fire fighting system';
  public static SECURITY_AUTOMATION : string = 'Safety and Security automation';
  public static SHOWER_ENCLOSURES : string = 'Shower Enclosures';
  public static FALSE_CEILING : string = 'False ceiling';
  public static SPECIAL_ELEVATIONAL_FEATURES_IN_FRP_FERRO_GRC : string = 'Special elevational features in FRP/Ferro/GRC';
  public static BOARDS_AND_SIGNAGES_INSIDE_BUILDING : string = 'Boards & Signages inside building';

  // Value Constant
  public static NUMBER_OF_FRACTION_DIGIT = 2;
  public static CLONE_ITEMS:string[]=['Cost Head','Category','Work Item','Quantity','Rate Analysis'];


  //STR Constants
  public static STR_ALL_BUILDING = 'All Buildings';
  public static STR_EMPTY = '';
  public static STR_COMMA_SPACE = ', ';
  public static STR_DOUBLE_INVERTED_COMMA = '" ';
  public static STR_AND = ' AND ';
  public static STR_BUILDING = 'building';
  public static STR_NAME = 'Name';
  public static STR_BUILDING_NAME = Constants.STR_BUILDING + Constants.STR_NAME;
  public static STR_COSTHEAD = 'costHead';
  public static STR_COSTHEAD_NAME = Constants.STR_COSTHEAD + Constants.STR_NAME;
  public static STR_MATERIAL = 'material';
  public static STR_Material_NAME = Constants.STR_MATERIAL + Constants.STR_NAME;
  public static STR_DIRECT = 'Direct';

  //ALSQL uses constants
  public static ALASQL_FROM = ' FROM ? ';
  public static ALASQL_GROUP_BY_MATERIAL_TAKEOFF_MATERIAL_WISE = 'GROUP BY buildingName, costHeadName, workItemName, quantityName, unit ';
  public static ALASQL_ORDER_BY_MATERIAL_TAKEOFF_MATERIAL_WISE = 'ORDER BY buildingName, costHeadName, workItemName,quantityName ';
  public static ALASQL_SELECT_MATERIAL_TAKEOFF_MATERIAL_WISE =
    'SELECT buildingName AS header, costHeadName, workItemName AS rowValue, SUM(quantity) AS Total, unit ';
  public static ALASQL_SELECT_QUANTITY_NAME_AS = ' quantityName AS subValue ';
  public static ALASQL_WHERE_MATERIAL_NAME_EQUALS_TO = 'WHERE materialName = ?';
  public static ALASQL_SELECT_BUILDING_NAME = ' buildingName = "';
  public static ALASQL_SELECT_MATERIAL_TAKEOFF_COSTHEAD_WISE =
    'SELECT materialName AS header, costHeadName, workItemName AS rowValue, SUM(quantity) AS Total, unit';
  public static ALASQL_WHERE_COSTHEAD_NAME_EQUALS_TO = 'WHERE costHeadName = ?';
  public static ALASQL_GROUP_MATERIAL_WORKITEM_QUANTITY_MATERIAL_TAKEOFF_COSTHEAD_WISE =
    'GROUP BY materialName, costHeadName, workItemName, quantityName, unit ';
  public static ALASQL_ORDER_BY_MATERIAL_WORKITEM_COSTHEAD_WISE = 'ORDER BY materialName,costHeadName, workItemName, quantityName ';
  public static ALASQL_GROUP_MATERIAL_BUILDING_QUANTITY_MATERIAL_TAKEOFF_COSTHEAD_WISE =
    'GROUP BY materialName, buildingName, quantityName, unit ';
  public static ALASQL_ORDER_BY_MATERIAL_BUILDING_MATERIAL_TAKEOFF_COSTHEAD_WISE = 'ORDER BY materialName, costHeadName, buildingName, quantityName ';
  public static ALASQL_SELECT_MATERIAL_TAKEOFF_COSTHEAD_WISE_FOR_ALL_BUILDINGS =
    'SELECT materialName AS header, costHeadName, buildingName AS rowValue, SUM(quantity) AS Total, unit';
  public static ALASQL_GROUP_MATERIAL_BUILDING_QUANTITY_MATERIAL_TAKEOFF_COSTHEAD_WISE_FOR_ALL_BUILDINGS =
    'GROUP BY materialName, costHeadName, buildingName, quantityName, unit ';
  public static ALASQL_MATERIAL_NOT_LABOUR = ' materialName NOT LIKE "%Labour%" ';
  public static ALASQL_MATERIAL_NOT_LABOR = ' materialName NOT LIKE "%Labor%" ';
  public static ALASQL_AND_MATERIAL_NOT_LABOUR = ' AND ' + Constants.ALASQL_MATERIAL_NOT_LABOUR +
    ' AND ' + Constants.ALASQL_MATERIAL_NOT_LABOR;

  // Error Messages
  public static MESSAGE_FOR_COSTHEADS_MISSING_COST_ESTIMATION = 'Oop\'s! looks like you haven\'t provided Cost Estimation for ';
}
export=Constants;
