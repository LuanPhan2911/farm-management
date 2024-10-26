export class UnAuthorizedError extends Error {
  data?: any;
  constructor(data?: any, message = "Unauthorized") {
    super(message);
    this.data = data;
  }
}
export class StaffExistError extends Error {
  data?: any;
  constructor(data?: any, message = "Staff does not exist") {
    super(message);
    this.data = data;
  }
}
// Custom error classes
export class MaterialExistError extends Error {
  data?: any;
  constructor(data?: any, message = "Material does not exist") {
    super(message);
    this.data = data;
  }
}

export class MaterialUpdateQuantityError extends Error {
  data?: any;
  constructor(data?: any, message = "Quantity is not enough in stock to use") {
    super(message);
    this.data = data;
  }
}
export class MaterialUsageExistError extends Error {
  data?: any;
  constructor(data?: any, message = "Material usage not exist") {
    super(message);
    this.data = data;
  }
}
export class MaterialUsageUpdateQuantityError extends Error {
  data?: any;
  constructor(data?: any, message = "Quantity is not enough in stock to use") {
    super(message);
    this.data = data;
  }
}

export class EquipmentDetailExistError extends Error {
  data?: any;
  constructor(data?: any, message = "Equipment detail does not exist") {
    super(message);
    this.data = data;
  }
}
export class EquipmentUsageExistError extends Error {
  data?: any;
  constructor(data?: any, message = "Equipment usage not exist") {
    super(message);
    this.data = data;
  }
}

export class ActivityExistError extends Error {
  data?: any;
  constructor(data?: any, message = "Activity does not exist") {
    super(message);
    this.data = data;
  }
}
export class ActivityCreatePermissionError extends Error {
  data?: any;
  constructor(data?: any, message = "No have permission to create activity") {
    super(message);
    this.data = data;
  }
}

export class ActivityUpdateStatusError extends Error {
  data?: any;
  constructor(
    data?: any,
    message = "Activity status is in progress or pending can update usage"
  ) {
    super(message);
    this.data = data;
  }
}
export class ActivityUpdatePermissionError extends Error {
  data?: any;
  constructor(data?: any, message = "No have permission to update activity") {
    super(message);
    this.data = data;
  }
}
