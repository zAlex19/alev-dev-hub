--!strict
local RequestGuard = {}

local buckets: {[Player]: {[string]: {tokens: number, last: number}}} = {}
local locks: {[Player]: {[string]: boolean}} = {}

function RequestGuard.Allow(player: Player, key: string, rate: number?, burst: number?): boolean
	rate = math.max(0.1, tonumber(rate) or 5)
	burst = math.max(1, tonumber(burst) or math.ceil(rate * 2))

	local playerBuckets = buckets[player]
	if not playerBuckets then
		playerBuckets = {}
		buckets[player] = playerBuckets
	end

	local now = os.clock()
	local bucket = playerBuckets[key]
	if not bucket then
		bucket = {tokens = burst, last = now}
		playerBuckets[key] = bucket
	end

	local elapsed = math.max(0, now - bucket.last)
	bucket.last = now
	bucket.tokens = math.min(burst, bucket.tokens + elapsed * rate)

	if bucket.tokens < 1 then
		return false
	end

	bucket.tokens -= 1
	return true
end

function RequestGuard.TryLock(player: Player, key: string): boolean
	local playerLocks = locks[player]
	if not playerLocks then
		playerLocks = {}
		locks[player] = playerLocks
	end

	if playerLocks[key] then
		return false
	end

	playerLocks[key] = true
	return true
end

function RequestGuard.Unlock(player: Player, key: string)
	local playerLocks = locks[player]
	if playerLocks then
		playerLocks[key] = nil
	end
end

function RequestGuard.Cleanup(player: Player)
	buckets[player] = nil
	locks[player] = nil
end

return RequestGuard
