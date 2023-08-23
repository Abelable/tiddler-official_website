import BaseService from "../../../service/baseService";

class SupplierService extends BaseService {
  async getCategoryOptions() {
    return await this.get(`${this.yb_mmsUrl}/api/v4/shop/category`);
  }

  async getRegionOptions() {
    return await this.get(`${this.yb_mmsUrl}/api/v4/misc/all`);
  }

  async shopApply({
    tel,
    email,
    province,
    city,
    district,
    address,
    contacts_name,
    id_card_no,
    idcard_front,
    idcard_reverse,
    handheld_idcard,
    type_id,
    supplier_name,
    zhizhao,
    shop_recruitment,
    is_free = 0,
  }, success) {
    return await this.post(`${this.yb_mmsUrl}/api/v4/shop/apply`, {
      tel,
      email,
      province,
      city,
      district,
      address,
      contacts_name,
      id_card_no,
      idcard_front,
      idcard_reverse,
      handheld_idcard,
      type_id,
      supplier_name,
      zhizhao,
      shop_recruitment,
      is_free,
    }, success);
  }

  async getStatusInfo() {
    return await this.get(`${this.yb_mmsUrl}/api/v4/shop/is-past`);
  }
}

export default SupplierService;
