import {Queue} from 'bull';
import {Injectable} from '@nestjs/common';
import {BullAdapter} from '@bull-board/api/bullAdapter';
import {BaseAdapter} from '@bull-board/api/dist/src/queueAdapters/base';

@Injectable()
export class BullBoardQueue {
}

export const queuePool: Set<Queue> = new Set<Queue>();
export const getBullBoardQueues = (): BaseAdapter[] => {
    return [...queuePool].reduce((acc: BaseAdapter[], val) => {
        acc.push(new BullAdapter(val))
        return acc
    }, []);
}