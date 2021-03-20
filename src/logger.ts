import Poplar from 'poplar-logger';

import Config from '../config.json';

export default new Poplar({
    level: Config.Logger.level,
    pretty: Config.Logger.pretty,
    color: Config.Logger.color
});