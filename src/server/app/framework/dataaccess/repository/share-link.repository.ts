import RepositoryBase = require("./base/repository.base");
import ShareLink = require("../mongoose/share-link");
import ShareLinkSchema = require("../schemas/share-link.schema");


class ShareLinkRepository extends RepositoryBase<ShareLink> {
  constructor() {
    super(ShareLinkSchema);
  }
}
Object.seal(ShareLinkRepository);
export = ShareLinkRepository;
