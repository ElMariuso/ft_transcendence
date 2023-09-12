import { Injectable } from '@nestjs/common';

import { UserQuery } from 'src/Query/user.query';

@Injectable()
export class GameService {
    constructor(private readonly userQuery: UserQuery) {}
}
