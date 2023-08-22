import BaseService from '../../../service/baseService'

class SupplierService extends BaseService {
  async getCategoryOptions() {
    return await this.get(`${this.yb_mmsUrl}/api/v4/shop/category`)
  }
}

export default SupplierService